const mongoose = require('mongoose');

const HotelAnalyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    totalBookings: { type: Number, default: 0 },
    availableRooms: { type: Number, default: 0 },
    currentGuests: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    currency: { type: String, default: 'EUR' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model('HotelAnalytics', HotelAnalyticsSchema);


