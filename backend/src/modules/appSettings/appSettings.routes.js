const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./appSettings.controller');

router.get('/', ctrl.getSettings);
router.put('/:key', authenticate, authorize('admin'), ctrl.updateValidators, ctrl.updateSetting);

module.exports = router;
