const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./offlineReservation.controller');

router.get('/check-availability', authenticate, authorize('admin'), ctrl.checkAvailability);
router.get('/search/:reservationNumber', ctrl.searchReservationByNumber);
router.get('/', authenticate, authorize('admin'), ctrl.listReservations);
router.get('/:id', authenticate, authorize('admin'), ctrl.getReservation);
router.post('/', authenticate, authorize('admin'), ctrl.createValidators, ctrl.createReservation);
router.patch('/:id/status', authenticate, authorize('admin'), ctrl.updateStatus);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteReservation);

module.exports = router;


