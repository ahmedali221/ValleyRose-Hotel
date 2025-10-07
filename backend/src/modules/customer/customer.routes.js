const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./customer.controller');

router.get('/', authenticate, authorize('admin'), ctrl.listCustomers);
router.get('/:id', authenticate, authorize('admin'), ctrl.getCustomer);
router.post('/', authenticate, authorize('admin'), ctrl.createValidators, ctrl.createCustomer);
router.post('/public', ctrl.createValidators, ctrl.createCustomerPublic);
router.put('/:id', authenticate, authorize('admin'), ctrl.updateCustomer);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteCustomer);

module.exports = router;


