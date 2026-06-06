import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import defaultLogo from '../../assets/Header/Vector.png';
import defaultCharacter from '../../assets/reservations/chracter.png';
import HeaderHero from '../../components/HeaderHero';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import DynamicImage from '../../components/DynamicImage';
import checkBanner from '../../assets/image.png';
import { reservationService } from '../../services/reservationService';
import { useTranslation } from '../../locales';

// ─── Cancel Confirmation Modal ────────────────────────────────────────────────

function CancelModal({ reservation, onConfirm, onClose, loading, error, t }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!loading ? onClose : undefined}
        />

        {/* Dialog */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Warning icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-2">
            {t('checkReservation.confirmCancel')}
          </h3>

          <p className="text-sm text-gray-500 text-center mb-1">
            {t('checkReservation.reservation')}{' '}
            <span className="font-semibold text-gray-700">{reservation.reservationNumber}</span>
          </p>
          <p className="text-sm text-gray-500 text-center mb-6">
            {reservation.roomType} &middot; {reservation.customer?.firstName} {reservation.customer?.lastName}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {t('checkReservation.keepReservation')}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('checkReservation.cancelling')}
                </span>
              ) : (
                t('checkReservation.confirmCancelBtn')
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CheckReservation = () => {
  const [reservationCode, setReservationCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const { t } = useTranslation();
  const { settings } = useSiteSettings();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!reservationCode.trim()) {
      setError(t('checkReservation.enterReservationCode'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await reservationService.searchReservation(reservationCode);
      setReservation(response.data);
    } catch (err) {
      setError(err.message);
      setReservation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;
    setCancelling(true);
    setCancelError('');

    try {
      await reservationService.cancelReservation(reservation._id);
      setShowCancelModal(false);
      setReservation((prev) => ({ ...prev, status: 'Cancelled' }));
    } catch (err) {
      setCancelError(t('checkReservation.cancelFailed') + ' ' + err.message);
    } finally {
      setCancelling(false);
    }
  };

  const openCancelModal = () => {
    setCancelError('');
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelling) return;
    setShowCancelModal(false);
    setCancelError('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <motion.div
      className="min-h-screen content-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderHero
        backgroundImage={checkBanner}
        imageKey="check_reservation_hero"
        showButtons={false}
        customTitle={
          <>
            <span className="text-white">{t('checkReservation.title')}</span>
          </>
        }
      />

      {/* Main Content */}
      <div className="container mx-auto py-6 sm:py-8 lg:py-12 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Search Form */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Quick Access Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl sm:text-3xl lg:text-4xl title-font text-gray-800 mb-3 sm:mb-4 text-center lg:text-left"
                style={{ fontFamily: 'serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t('checkReservation.quickAccess')}
              </motion.h2>
              <motion.p
                className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('checkReservation.description')}
              </motion.p>

              <motion.form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.input
                  type="text"
                  value={reservationCode}
                  onChange={(e) => setReservationCode(e.target.value)}
                  placeholder={t('checkReservation.placeholder')}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? t('checkReservation.searching') : t('checkReservation.search')}
                </motion.button>
              </motion.form>

              {error && (
                <motion.div
                  className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.h3
                className="text-xl sm:text-2xl lg:text-3xl title-font text-gray-800 mb-3 sm:mb-4 text-center lg:text-left"
                style={{ fontFamily: 'serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {t('checkReservation.support')}
              </motion.h3>
              <motion.p
                className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 text-center lg:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                {t('checkReservation.supportDescription')}
              </motion.p>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 btn-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">+43 1 20 43 969</span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 btn-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base break-all">valleyrose@speed.at </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Results or Illustration */}
          <motion.div
            className="flex items-center justify-center order-first lg:order-last"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {reservation ? (
              <motion.div
                className="w-full max-w-md bg-purple-50 rounded-lg p-4 sm:p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="flex items-center gap-3 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <DynamicImage
                    settingsKey="check_reservation_logo_vector"
                    defaultImage={defaultLogo}
                    alt="Valley Rose"
                    className="h-6 sm:h-8"
                  />
                  <div>
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.reservation')}</span>
                    <span className="valley-rose-text font-semibold ml-2 text-sm sm:text-base">{reservation.reservationNumber}</span>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-3 sm:space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.fullName')}</span>
                    <span className="font-medium text-sm sm:text-base">{reservation.customer.firstName} {reservation.customer.lastName}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.emailAddress')}</span>
                    <span className="font-medium text-sm sm:text-base break-all">{reservation.customer.email}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.phoneNumber')}</span>
                    <span className="font-medium text-sm sm:text-base">{reservation.customer.phoneNumber}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.roomType')}</span>
                    <span className="font-medium text-sm sm:text-base">{reservation.roomType}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.numberOfGuests')}</span>
                    <span className="font-medium text-sm sm:text-base">{reservation.numberOfGuests} {t('common.guests')}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.checkInDate')}</span>
                    <span className="font-medium text-sm sm:text-base">{formatDate(reservation.checkInDate)}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.checkOutDate')}</span>
                    <span className="font-medium text-sm sm:text-base">{formatDate(reservation.checkOutDate)}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.cost')}</span>
                    <span className="font-medium text-sm sm:text-base">{reservation.cost}€</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.paymentMethod')}</span>
                    <span className="font-medium text-sm sm:text-base">{reservation.paymentMethod}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">{t('checkReservation.status')}</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      reservation.status === 'Confirmed'
                        ? 'bg-green-500 text-white'
                        : reservation.status === 'Cancelled'
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                    }`}>
                      {reservation.status === 'Confirmed' ? t('checkReservation.successful') : reservation.status}
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  onClick={openCancelModal}
                  disabled={reservation.status === 'Cancelled'}
                  className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                    reservation.status === 'Cancelled'
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: reservation.status === 'Cancelled' ? 1 : 1.02 }}
                  whileTap={{ scale: reservation.status === 'Cancelled' ? 1 : 0.98 }}
                >
                  {reservation.status === 'Cancelled' ? t('checkReservation.reservationCancelled') : t('checkReservation.cancelReservation')}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  className="mb-4 sm:mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <DynamicImage
                    settingsKey="check_reservation_character"
                    defaultImage={defaultCharacter}
                    alt="Reservation Check"
                    className="mx-auto max-w-xs sm:max-w-sm"
                  />
                </motion.div>
                <motion.p
                  className="text-gray-600 text-base sm:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {t('checkReservation.welcomeMessage')}
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && reservation && (
        <CancelModal
          reservation={reservation}
          onConfirm={handleCancelReservation}
          onClose={closeCancelModal}
          loading={cancelling}
          error={cancelError}
          t={t}
        />
      )}
    </motion.div>
  );
};

export default CheckReservation;
