const { body, validationResult } = require('express-validator');
const Room = require('./room.model');

function img(file) {
  return file ? { url: file.path, publicId: file.filename } : undefined;
}

const createValidators = [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('pricePerNight').isFloat({ min: 0 }),
  body('ratingSuggestion').optional().isFloat({ min: 1, max: 5 }),
  body('type').isIn(['Single', 'Double', 'Triple']),
];

async function createRoom(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const gallery = (req.files?.serviceGallery || []).map(img);
  const payload = {
    ...req.body,
    coverImage: img(req.files?.coverImage?.[0]),
    thumbnailImage: img(req.files?.thumbnailImage?.[0]),
    serviceGallery: gallery,
  };
  const doc = await Room.create(payload);
  res.status(201).json(doc);
}

async function listRooms(_req, res) {
  const items = await Room.find().sort({ createdAt: -1 });
  res.json(items);
}

async function getRoom(req, res) {
  const item = await Room.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Room not found' });
  res.json(item);
}

async function updateRoom(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const changes = { ...req.body };
  if (req.files?.coverImage?.[0]) changes.coverImage = img(req.files.coverImage[0]);
  if (req.files?.thumbnailImage?.[0]) changes.thumbnailImage = img(req.files.thumbnailImage[0]);
  if (req.files?.serviceGallery?.length) changes.serviceGallery = req.files.serviceGallery.map(img);
  const item = await Room.findByIdAndUpdate(req.params.id, changes, { new: true });
  if (!item) return res.status(404).json({ message: 'Room not found' });
  res.json(item);
}

async function deleteRoom(req, res) {
  const item = await Room.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Room not found' });
  res.json({ success: true });
}

module.exports = { createValidators, createRoom, listRooms, getRoom, updateRoom, deleteRoom };


