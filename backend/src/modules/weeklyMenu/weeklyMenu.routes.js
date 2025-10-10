const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./weeklyMenu.controller');

router.get('/', ctrl.getAll);
router.get('/:day', ctrl.getByDay);
router.put('/', authenticate, authorize('admin'), ctrl.upsertValidators, ctrl.upsert);
router.post('/:day/add-meal', authenticate, authorize('admin'), ctrl.addMealToDay);
router.post('/:day/remove-meal', authenticate, authorize('admin'), ctrl.removeMealFromDay);
router.delete('/:day', authenticate, authorize('admin'), ctrl.clearDay);

module.exports = router;



