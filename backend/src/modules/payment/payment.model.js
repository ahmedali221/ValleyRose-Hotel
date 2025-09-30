const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'OfflineReservation', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EUR' },
    paymentMethod: { type: String, enum: ['Cash', 'CreditCard', 'BankTransfer'], required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed', 'Refunded'], default: 'Paid' },
    transactionId: { type: String },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);


