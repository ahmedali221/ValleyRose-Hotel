const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./meal.controller');

router.get('/', ctrl.listMeals);
router.post('/', authenticate, authorize('admin'), ctrl.createValidators, ctrl.createMeal);
router.put('/:id', authenticate, authorize('admin'), ctrl.updateMeal);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteMeal);
router.patch('/:id/toggle-recommended', authenticate, authorize('admin'), ctrl.toggleRecommended);

module.exports = router;


