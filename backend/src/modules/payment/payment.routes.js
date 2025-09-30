const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./payment.controller');

router.get('/', authenticate, authorize('admin'), ctrl.listPayments);
router.get('/:id', authenticate, authorize('admin'), ctrl.getPayment);
router.post('/', authenticate, authorize('admin'), ctrl.createValidators, ctrl.createPayment);
router.put('/:id', authenticate, authorize('admin'), ctrl.updatePayment);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deletePayment);

module.exports = router;


