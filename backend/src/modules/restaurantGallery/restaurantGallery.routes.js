const router = require('express').Router();
const multer = require('multer');
const { storage } = require('../../setup/cloudinary');
const upload = multer({ storage });
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./restaurantGallery.controller');

router.get('/', ctrl.listImages);
router.post('/', authenticate, authorize('admin'), upload.single('image'), ctrl.createValidators, ctrl.addImage);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteImage);

module.exports = router;



