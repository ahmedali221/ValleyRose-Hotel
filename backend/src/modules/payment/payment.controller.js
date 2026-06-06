const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const Payment = require('./payment.model');
const OfflineReservation = require('../offlineReservation/offlineReservation.model');

// Stripe client initialised once at module scope (not per-request)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Wraps async handlers so unhandled errors produce a JSON 500 instead of crashing
const asyncHandler = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(`[Payment ${req.method} ${req.path}]`, err);
    if (!res.headersSent) {
      res.status(500).json({ message: err.message || 'Internal error' });
    }
  });

// ─── Validators ───────────────────────────────────────────────────────────────

const createValidators = [
  body('reservationId').isMongoId(),
  body('customerId').isMongoId(),
  body('amount').isFloat({ min: 0 }),
  body('currency').optional().isString(),
  body('paymentMethod').optional().isString(),
  body('paymentStatus').optional().isIn(['Paid', 'Pending', 'Failed', 'Refunded', 'PartiallyPaid']),
  body('transactionId').optional().isString(),
  body('paidAt').optional().isISO8601(),
];

const createIntentValidators = [
  body('amount').isInt({ min: 1 }).withMessage('amount must be a positive integer (cents)'),
  body('currency').optional().isString(),
  body('paymentType').isIn(['full', 'checkin_fee']).withMessage('paymentType must be full or checkin_fee'),
];

// amount and totalCost are no longer trusted from the client — sourced from Stripe + DB
const confirmValidators = [
  body('paymentIntentId').notEmpty().withMessage('paymentIntentId is required'),
  body('reservationId').isMongoId(),
  body('customerId').isMongoId(),
  body('paymentType').isIn(['full', 'checkin_fee']),
];

// ─── Stripe: Create PaymentIntent ────────────────────────────────────────────

async function createIntent(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { amount, currency = 'eur', paymentType, metadata = {}, idempotencyKey } = req.body;

  const paymentIntent = await stripe.paymentIntents.create(
    { amount, currency, metadata: { paymentType, ...metadata } },
    // Use the caller-supplied key (stable per booking session) or generate one so
    // retries on network failure don't create duplicate intents on Stripe
    { idempotencyKey: idempotencyKey || crypto.randomUUID() }
  );

  res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
}

// ─── Stripe: Confirm Payment & create Payment record ─────────────────────────

async function confirmPayment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { paymentIntentId, reservationId, customerId, paymentType } = req.body;

  // 1. Verify the PaymentIntent with Stripe — this is the source of truth for amount
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== 'succeeded') {
    return res.status(400).json({ message: `Payment not completed. Stripe status: ${pi.status}` });
  }

  // 2. Source of truth for total cost = the reservation in DB, not the client
  const reservation = await OfflineReservation.findById(reservationId);
  if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

  // 3. Idempotency — if a payment record already exists for this intent, return it
  const existing = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
  if (existing) {
    return res.json({
      success: true,
      paymentId: existing._id,
      transactionId: paymentIntentId,
      amountDue: existing.amountDue,
      idempotent: true,
    });
  }

  // 4. Use Stripe's actual charged amount (pi.amount is in cents)
  const amountEuros = pi.amount / 100;
  const totalCost = reservation.cost;

  const isFull = paymentType === 'full' || amountEuros >= totalCost;
  const paymentStatus = isFull ? 'Paid' : 'PartiallyPaid';
  const amountDue = isFull ? 0 : Math.round((totalCost - amountEuros) * 100) / 100;
  const reservationPaymentStatus = paymentStatus;

  const doc = await Payment.create({
    reservationId,
    customerId,
    amount: amountEuros,
    currency: (pi.currency || 'eur').toUpperCase(),
    paymentMethod: 'CreditCard',
    paymentStatus,
    paymentType,
    transactionId: paymentIntentId,
    stripePaymentIntentId: paymentIntentId,
    amountDue,
    paidAt: new Date(pi.created * 1000),
  });

  await OfflineReservation.findByIdAndUpdate(reservationId, { paymentStatus: reservationPaymentStatus });

  res.json({ success: true, paymentId: doc._id, transactionId: paymentIntentId, amountDue });
}

// ─── Stripe: Cancel PaymentIntent (called when user switches payment type) ───

async function cancelIntent(req, res) {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ message: 'paymentIntentId is required' });

  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    res.json({ success: true });
  } catch (error) {
    // Non-fatal — intent may already be cancelled or succeeded
    res.json({ success: false, reason: error.message });
  }
}

// ─── Stripe: Webhook ─────────────────────────────────────────────────────────

async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const payment = await Payment.findOne({ stripePaymentIntentId: pi.id });
      if (payment && payment.paymentStatus === 'Pending') {
        const newStatus = payment.paymentType === 'checkin_fee' ? 'PartiallyPaid' : 'Paid';
        payment.paymentStatus = newStatus;
        payment.paidAt = new Date(pi.created * 1000);
        await payment.save();
        if (payment.reservationId) {
          await OfflineReservation.findByIdAndUpdate(payment.reservationId, { paymentStatus: newStatus });
        }
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      // Single query — reuse the returned doc to avoid a second DB round-trip
      const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: pi.id },
        { paymentStatus: 'Failed' },
        { new: true }
      );
      if (payment?.reservationId) {
        await OfflineReservation.findByIdAndUpdate(payment.reservationId, { paymentStatus: 'Failed' });
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    // Return 500 so Stripe retries the event instead of silently dropping it
    return res.status(500).json({ received: false, error: error.message });
  }

  res.json({ received: true });
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

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

module.exports = {
  createValidators,
  createIntentValidators,
  confirmValidators,
  createIntent: asyncHandler(createIntent),
  confirmPayment: asyncHandler(confirmPayment),
  cancelIntent: asyncHandler(cancelIntent),
  handleWebhook,
  createPayment: asyncHandler(createPayment),
  listPayments: asyncHandler(listPayments),
  getPayment: asyncHandler(getPayment),
  updatePayment: asyncHandler(updatePayment),
  deletePayment: asyncHandler(deletePayment),
};
