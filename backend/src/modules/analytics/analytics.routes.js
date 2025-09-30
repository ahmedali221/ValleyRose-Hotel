const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./analytics.controller');

router.get('/', authenticate, authorize('admin'), ctrl.getAnalytics);

module.exports = router;


