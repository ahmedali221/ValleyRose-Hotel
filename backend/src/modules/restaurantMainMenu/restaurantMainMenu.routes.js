const router = require('express').Router();
const multer = require('multer');
const { storage } = require('../../setup/cloudinary');
const upload = multer({ storage });
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./restaurantMainMenu.controller');

router.get('/', ctrl.getPdf);
router.post('/', authenticate, authorize('admin'), upload.single('pdf'), ctrl.uploadPdf);
router.put('/page-count', authenticate, authorize('admin'), ctrl.updatePageCount);
router.delete('/', authenticate, authorize('admin'), ctrl.deletePdf);

module.exports = router;



