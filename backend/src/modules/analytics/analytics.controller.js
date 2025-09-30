const HotelAnalytics = require('./hotelAnalytics.model');
const OfflineReservation = require('../offlineReservation/offlineReservation.model');
const Payment = require('../payment/payment.model');
const Room = require('../room/room.model');

function startOfDay(date) { const d = new Date(date); d.setHours(0,0,0,0); return d; }
function endOfDay(date) { const d = new Date(date); d.setHours(23,59,59,999); return d; }

async function computeForDate(dateStr) {
  const date = startOfDay(dateStr || new Date());
  const next = endOfDay(date);

  const [roomsCount, bookings, payments] = await Promise.all([
    Room.countDocuments(),
    OfflineReservation.find({ createdAt: { $gte: date, $lte: next } }),
    Payment.find({ paidAt: { $gte: date, $lte: next }, paymentStatus: 'Paid' }),
  ]);

  const totalBookings = bookings.length;
  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Approximate current guests: reservations with check-in <= date <= check-out and status Confirmed/CheckedIn
  const currentGuests = await OfflineReservation.countDocuments({
    status: { $in: ['Confirmed', 'CheckedIn'] },
    checkInDate: { $lte: next },
    checkOutDate: { $gt: date },
  });

  const payload = {
    date,
    totalBookings,
    availableRooms: Math.max(roomsCount - currentGuests, 0),
    currentGuests,
    totalEarnings,
    currency: 'EUR',
    updatedAt: new Date(),
  };

  const doc = await HotelAnalytics.findOneAndUpdate({ date }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
  return doc;
}

async function getAnalytics(req, res) {
  const doc = await computeForDate(req.query.date);
  res.json(doc);
}

module.exports = { getAnalytics, computeForDate };


