const router = require('express').Router();
const { authenticate, authorize } = require('../../middleware/auth');
const ctrl = require('./offlineReservation.controller');

router.get('/check-availability', authenticate, authorize('admin'), ctrl.checkAvailability);
router.get('/public/check-availability', ctrl.checkAvailabilityPublic);
router.get('/search/:reservationNumber', ctrl.searchReservationByNumber);
router.get('/', authenticate, authorize('admin'), ctrl.listReservations);
router.get('/:id', authenticate, authorize('admin'), ctrl.getReservation);
router.post('/', authenticate, authorize('admin'), ctrl.createValidators, ctrl.createReservation);
router.post('/public', ctrl.createValidators, ctrl.createReservationPublic);
router.patch('/:id/status', authenticate, authorize('admin'), ctrl.updateStatus);
router.patch('/public/:id/status', ctrl.updateStatusPublic);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteReservation);

module.exports = router;


