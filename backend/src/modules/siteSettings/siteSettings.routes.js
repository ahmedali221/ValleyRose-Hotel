const router = require('express').Router();
const multer = require('multer');
const { storage } = require('../../setup/cloudinary');
const upload = multer({ storage });
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./siteSettings.controller');

// Public route to get settings
router.get('/', ctrl.getSettings);

// Admin route to update a setting by key
router.put(
  '/:key',
  authenticate,
  authorize('admin'),
  upload.single('image'), // Expecting a single file with field name 'image'
  ctrl.updateSetting
);

module.exports = router;
