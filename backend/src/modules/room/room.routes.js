const router = require('express').Router();
const multer = require('multer');
const { storage } = require('../../setup/cloudinary');
const upload = multer({ storage });
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./room.controller');

router.get('/', ctrl.listRooms);
router.get('/:id', ctrl.getRoom);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'serviceGallery', maxCount: 20 },
  ]),
  ctrl.createValidators,
  ctrl.createRoom
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'serviceGallery', maxCount: 20 },
  ]),
  ctrl.createValidators,
  ctrl.updateRoom
);

router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteRoom);

module.exports = router;


