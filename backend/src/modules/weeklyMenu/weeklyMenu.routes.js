const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./weeklyMenu.controller');

router.get('/', ctrl.getAll);
router.get('/:day', ctrl.getByDay);
router.put('/', authenticate, authorize('admin'), ctrl.upsertValidators, ctrl.upsert);
router.delete('/:day', authenticate, authorize('admin'), ctrl.clearDay);

module.exports = router;



