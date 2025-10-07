const { body, validationResult } = require('express-validator');
const OfflineReservation = require('./offlineReservation.model');
const Room = require('../room/room.model');

const createValidators = [
  body('roomId').isMongoId(),
  body('roomType').isIn(['Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite']),
  body('checkInDate').isISO8601(),
  body('checkOutDate').isISO8601(),
  body('customerId').isMongoId(),
  body('numberOfGuests').isInt({ min: 1 }),
];

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

async function isRoomAvailable(roomId, checkInDate, checkOutDate) {
  const existing = await OfflineReservation.find({ roomId, status: { $ne: 'Cancelled' } });
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  return !existing.some((r) => overlaps(start, end, r.checkInDate, r.checkOutDate));
}

function generateReservationNumber() {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `#${rand}`;
}

async function createReservation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  const { roomId, roomType, checkInDate, checkOutDate, customerId, numberOfGuests } = req.body;
  
  // Log the reservation data being sent for creation
  console.log('Creating reservation with data:', {
    roomId,
    roomType,
    checkInDate,
    checkOutDate,
    customerId,
    numberOfGuests,
    timestamp: new Date().toISOString()
  });
  
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.type !== roomType) return res.status(400).json({ message: 'Room type mismatch' });
  
  const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
  if (!available) return res.status(409).json({ message: 'Room not available for selected dates' });
  
  // Calculate cost and nights
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);
  const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const cost = room.pricePerNight * nights;
  
  const reservationNumber = generateReservationNumber();
  const doc = await OfflineReservation.create({ 
    ...req.body, 
    reservationNumber,
    cost,
    nights,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid'
  });
  
  // Log successful reservation creation with customer reference
  console.log('Reservation created successfully:', {
    reservationId: doc._id,
    reservationNumber: doc.reservationNumber,
    customerId: doc.customerId,
    roomId: doc.roomId,
    roomType: doc.roomType,
    checkInDate: doc.checkInDate,
    checkOutDate: doc.checkOutDate,
    numberOfGuests: doc.numberOfGuests,
    cost: doc.cost,
    nights: doc.nights,
    status: doc.status,
    createdAt: doc.createdAt
  });
  
  res.status(201).json(doc);
}

async function listReservations(req, res) {
  try {
    let query = {};
    
    // Filter by status if provided
    if (req.query.status && req.query.status.trim() !== '') {
      query.status = req.query.status;
    }
    
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalItems = await OfflineReservation.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    
    const items = await OfflineReservation.find(query)
      .populate('roomId')
      .populate('customerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Send response with pagination info
    res.json({
      data: items,
      pagination: {
        current: page,
        total: totalPages,
        count: items.length,
        totalItems
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
}

async function getReservation(req, res) {
  const item = await OfflineReservation.findById(req.params.id).populate('roomId').populate('customerId');
  if (!item) return res.status(404).json({ message: 'Reservation not found' });
  res.json(item);
}

async function updateStatus(req, res) {
  const { status } = req.body;
  if (!['Confirmed', 'Cancelled', 'CheckedIn'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const item = await OfflineReservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!item) return res.status(404).json({ message: 'Reservation not found' });
  res.json(item);
}

async function deleteReservation(req, res) {
  const item = await OfflineReservation.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Reservation not found' });
  res.json({ success: true });
}

// Check availability for rooms of a specific type within date range
async function checkAvailability(req, res) {
  try {
    const { roomType, checkInDate, checkOutDate } = req.query;
    
    if (!roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({ 
        message: 'Room type, check-in date, and check-out date are required' 
      });
    }

    // Validate dates
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    
    if (startDate >= endDate) {
      return res.status(400).json({ 
        message: 'Check-out date must be after check-in date' 
      });
    }

    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ 
        message: 'Check-in date cannot be in the past' 
      });
    }

    // Find all rooms of the specified type
    const rooms = await Room.find({ type: roomType });
    
    if (rooms.length === 0) {
      return res.json({
        success: true,
        availableRooms: [],
        totalRooms: 0,
        availableCount: 0
      });
    }

    // Check availability for each room
    const availableRooms = [];
    for (const room of rooms) {
      const isAvailable = await isRoomAvailable(room._id, checkInDate, checkOutDate);
      if (isAvailable) {
        availableRooms.push({
          _id: room._id,
          title: room.title,
          type: room.type,
          pricePerNight: room.pricePerNight,
          coverImage: room.coverImage
        });
      }
    }

    res.json({
      success: true,
      availableRooms,
      totalRooms: rooms.length,
      availableCount: availableRooms.length,
      checkInDate,
      checkOutDate,
      roomType
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
}

async function searchReservationByNumber(req, res) {
  try {
    console.log('Search endpoint hit - no auth required');
    const { reservationNumber } = req.params;
    
    if (!reservationNumber) {
      console.log('No reservation number provided');
      return res.status(400).json({ 
        success: false,
        message: 'Reservation number is required' 
      });
    }

    // URL decode the reservation number in case it contains encoded characters
    const decodedReservationNumber = decodeURIComponent(reservationNumber);
    
    console.log('Raw reservation number:', reservationNumber);
    console.log('Decoded reservation number:', decodedReservationNumber);

    // Search for reservation by reservation number
    const reservation = await OfflineReservation.findOne({ reservationNumber: decodedReservationNumber })
      .populate('roomId')
      .populate('customerId');

    if (!reservation) {
      console.log('No reservation found for:', decodedReservationNumber);
      return res.status(404).json({ 
        success: false,
        message: 'Reservation not found' 
      });
    }

    // Format the response to match frontend expectations
    const formattedReservation = {
      _id: reservation._id,
      reservationNumber: reservation.reservationNumber,
      customer: {
        firstName: reservation.customerId.firstName,
        lastName: reservation.customerId.lastName,
        email: reservation.customerId.email,
        phoneNumber: reservation.customerId.phoneNumber
      },
      roomType: reservation.roomType,
      numberOfGuests: reservation.numberOfGuests,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      status: reservation.status,
      cost: reservation.roomId?.price || 0, // Assuming room has price field
      paymentMethod: 'Credit Card (Visa)', // Default for now
      createdAt: reservation.createdAt
    };

    res.json({
      success: true,
      data: formattedReservation
    });
  } catch (error) {
    console.error('Search reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search reservation',
      error: error.message
    });
  }
}

async function createReservationPublic(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  const { roomId, roomType, checkInDate, checkOutDate, customerId, numberOfGuests } = req.body;
  
  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.type !== roomType) return res.status(400).json({ message: 'Room type mismatch' });
    
    const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
    if (!available) return res.status(409).json({ message: 'Room not available for selected dates' });
    
    // Calculate cost and nights
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const cost = room.pricePerNight * nights;
    
    const reservationNumber = generateReservationNumber();
    const doc = await OfflineReservation.create({ 
      roomId, 
      roomType, 
      checkInDate, 
      checkOutDate, 
      customerId, 
      numberOfGuests, 
      reservationNumber,
      cost,
      nights,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid'
    });
    
    res.status(201).json(doc);
  } catch (error) {
    console.error('Public reservation creation error:', error);
    res.status(500).json({ message: 'Failed to create reservation', error: error.message });
  }
}

async function checkAvailabilityPublic(req, res) {
  try {
    const { roomType, checkInDate, checkOutDate } = req.query;
    
    if (!roomType || !checkInDate || !checkOutDate) {
      return res.status(400).json({ 
        message: 'Room type, check-in date, and check-out date are required' 
      });
    }

    // Validate dates
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    
    if (startDate >= endDate) {
      return res.status(400).json({ 
        message: 'Check-out date must be after check-in date' 
      });
    }

    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ 
        message: 'Check-in date cannot be in the past' 
      });
    }

    // Find all rooms of the specified type
    const rooms = await Room.find({ type: roomType });
    
    if (rooms.length === 0) {
      return res.json({
        available: false,
        message: 'No rooms of this type available',
        cost: 0
      });
    }

    // Check availability for each room
    let availableRoom = null;
    for (const room of rooms) {
      const isAvailable = await isRoomAvailable(room._id, checkInDate, checkOutDate);
      if (isAvailable) {
        availableRoom = room;
        break; // Use the first available room
      }
    }

    if (availableRoom) {
      // Calculate cost based on number of nights
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const cost = availableRoom.pricePerNight * nights;
      
      console.log('Cost calculation:', {
        pricePerNight: availableRoom.pricePerNight,
        nights: nights,
        totalCost: cost,
        checkInDate,
        checkOutDate
      });
      
      return res.json({
        available: true,
        cost: cost,
        roomId: availableRoom._id,
        roomType: availableRoom.type,
        nights: nights
      });
    } else {
      return res.json({
        available: false,
        message: 'No rooms available for selected dates',
        cost: 0
      });
    }

  } catch (error) {
    console.error('Public availability check error:', error);
    res.status(500).json({
      available: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
}

async function updateStatusPublic(req, res) {
  const { status } = req.body;
  if (!['Confirmed', 'Cancelled', 'CheckedIn'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  
  try {
    const item = await OfflineReservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) return res.status(404).json({ message: 'Reservation not found' });
    res.json(item);
  } catch (error) {
    console.error('Public status update error:', error);
    res.status(500).json({ message: 'Failed to update reservation status', error: error.message });
  }
}

module.exports = { 
  createValidators, 
  createReservation, 
  createReservationPublic,
  listReservations, 
  getReservation, 
  updateStatus,
  updateStatusPublic,
  deleteReservation, 
  isRoomAvailable,
  checkAvailability,
  checkAvailabilityPublic,
  searchReservationByNumber
};


