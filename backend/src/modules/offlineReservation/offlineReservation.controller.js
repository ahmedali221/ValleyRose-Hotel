const { body, validationResult } = require('express-validator');
const OfflineReservation = require('./offlineReservation.model');
const Room = require('../room/room.model');

const createValidators = [
  body('roomId').isMongoId(),
  body('roomType').isIn(['Single', 'Double', 'Triple']),
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
  const { roomId, roomType, checkInDate, checkOutDate } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.type !== roomType) return res.status(400).json({ message: 'Room type mismatch' });
  const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
  if (!available) return res.status(409).json({ message: 'Room not available for selected dates' });
  const reservationNumber = generateReservationNumber();
  const doc = await OfflineReservation.create({ ...req.body, reservationNumber });
  res.status(201).json(doc);
}

async function listReservations(_req, res) {
  const items = await OfflineReservation.find().populate('roomId').populate('customerId').sort({ createdAt: -1 });
  res.json(items);
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

module.exports = { createValidators, createReservation, listReservations, getReservation, updateStatus, deleteReservation, isRoomAvailable };


