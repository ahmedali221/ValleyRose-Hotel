const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'OfflineReservation', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' },
    paymentMethod: { type: String, default: 'CreditCard' },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed', 'Refunded', 'PartiallyPaid'], default: 'Pending' },
    paymentType: { type: String, enum: ['full', 'checkin_fee'] },
    transactionId: { type: String },
    stripePaymentIntentId: { type: String, index: { unique: true, sparse: true } },
    amountDue: { type: Number, default: 0 },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
