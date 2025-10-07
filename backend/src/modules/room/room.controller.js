const { body, validationResult } = require('express-validator');
const Room = require('./room.model');

function img(file) {
  return file ? { url: file.path, publicId: file.filename } : undefined;
}

const createValidators = [
  // Validate title as JSON string
  body('title')
    .isString()
    .withMessage('Title must be a valid JSON string')
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!parsed.english || !parsed.german) {
          throw new Error('Title must contain both english and german fields');
        }
        return true;
      } catch (error) {
        throw new Error('Invalid title format');
      }
    }),
  // Validate description as JSON string
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a valid JSON string')
    .custom((value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        throw new Error('Invalid description format');
      }
    }),
  // Other validations
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Price per night must be a positive number'),
  body('ratingSuggestion').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('type').isIn(['Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite']).withMessage('Invalid room type'),
];

async function createRoom(req, res) {
  console.log('Received request body:', req.body);
  console.log('Received files:', req.files);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  
  const gallery = (req.files?.serviceGallery || []).map(img);
  
  // Parse JSON strings for nested objects
  const payload = {
    ...req.body,
    title: typeof req.body.title === 'string' ? JSON.parse(req.body.title) : req.body.title,
    description: typeof req.body.description === 'string' ? JSON.parse(req.body.description) : req.body.description,
    coverImage: img(req.files?.coverImage?.[0]),
    thumbnailImage: img(req.files?.thumbnailImage?.[0]),
    serviceGallery: gallery,
  };
  
  console.log('Parsed payload:', payload);
  
  try {
    const doc = await Room.create(payload);
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: doc
    });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
}

async function listRooms(req, res) {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const filter = type ? { type } : {};
    
    const skip = (page - 1) * limit;
    const items = await Room.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Room.countDocuments(filter);
    
    res.json({
      success: true,
      data: items,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: items.length,
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
}

async function getRoom(req, res) {
  try {
    const item = await Room.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room',
      error: error.message
    });
  }
}

async function updateRoom(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const changes = { ...req.body };
    if (req.files?.coverImage?.[0]) changes.coverImage = img(req.files.coverImage[0]);
    if (req.files?.thumbnailImage?.[0]) changes.thumbnailImage = img(req.files.thumbnailImage[0]);
    if (req.files?.serviceGallery?.length) changes.serviceGallery = req.files.serviceGallery.map(img);
    
    const item = await Room.findByIdAndUpdate(req.params.id, changes, { new: true });
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Room updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update room',
      error: error.message
    });
  }
}

async function deleteRoom(req, res) {
  try {
    const item = await Room.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete room',
      error: error.message
    });
  }
}

async function getRoomTypes(req, res) {
  try {
    const roomTypes = ['Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite'];
    res.json({
      success: true,
      data: roomTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room types',
      error: error.message
    });
  }
}

async function debugRooms(req, res) {
  try {
    const rooms = await Room.find({});
    console.log('All rooms in database:', rooms);
    res.json({
      success: true,
      rooms: rooms,
      count: rooms.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
}

module.exports = { 
  createValidators, 
  createRoom, 
  listRooms, 
  getRoom, 
  updateRoom, 
  deleteRoom,
  getRoomTypes,
  debugRooms
};


