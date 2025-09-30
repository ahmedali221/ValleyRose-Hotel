const { body, validationResult } = require('express-validator');
const Payment = require('./payment.model');

const createValidators = [
  body('reservationId').isMongoId(),
  body('customerId').isMongoId(),
  body('amount').isFloat({ min: 0 }),
  body('currency').optional().isString(),
  body('paymentMethod').isIn(['Cash', 'CreditCard', 'BankTransfer']),
  body('paymentStatus').optional().isIn(['Paid', 'Pending', 'Failed', 'Refunded']),
  body('transactionId').optional().isString(),
  body('paidAt').optional().isISO8601(),
];

async function createPayment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const doc = await Payment.create(req.body);
  res.status(201).json(doc);
}

async function listPayments(_req, res) {
  const items = await Payment.find().populate('reservationId').populate('customerId').sort({ createdAt: -1 });
  res.json(items);
}

async function getPayment(req, res) {
  const item = await Payment.findById(req.params.id).populate('reservationId').populate('customerId');
  if (!item) return res.status(404).json({ message: 'Payment not found' });
  res.json(item);
}

async function updatePayment(req, res) {
  const item = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Payment not found' });
  res.json(item);
}

async function deletePayment(req, res) {
  const item = await Payment.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Payment not found' });
  res.json({ success: true });
}

module.exports = { createValidators, createPayment, listPayments, getPayment, updatePayment, deletePayment };


