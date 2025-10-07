const mongoose = require('mongoose');

const OfflineReservationSchema = new mongoose.Schema(
  {
    reservationNumber: { type: String, required: true, unique: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    roomType: { type: String, enum: ['Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite'], required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'CheckedIn'], default: 'Confirmed' },
    cost: { type: Number, required: true, min: 0 },
    nights: { type: Number, required: true, min: 1 },
    paymentMethod: { type: String, default: 'Credit Card' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Paid' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('OfflineReservation', OfflineReservationSchema);


