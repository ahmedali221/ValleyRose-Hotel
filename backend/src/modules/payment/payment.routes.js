const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./payment.controller');

// 10 requests per IP per minute on unauthenticated Stripe endpoints
const stripeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many payment requests, please try again shortly.' },
});

// Public Stripe routes (webhook is registered at app level in server.js before express.json)
router.post('/create-intent', stripeLimiter, ctrl.createIntentValidators, ctrl.createIntent);
router.post('/cancel-intent', stripeLimiter, ctrl.cancelIntent);
router.post('/confirm', stripeLimiter, ctrl.confirmValidators, ctrl.confirmPayment);

// Admin CRUD routes
router.get('/', authenticate, authorize('admin'), ctrl.listPayments);
router.get('/:id', authenticate, authorize('admin'), ctrl.getPayment);
router.post('/', authenticate, authorize('admin'), ctrl.createValidators, ctrl.createPayment);
router.put('/:id', authenticate, authorize('admin'), ctrl.updatePayment);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deletePayment);

module.exports = router;
