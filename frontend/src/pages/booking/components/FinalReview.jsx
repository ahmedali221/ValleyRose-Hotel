import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import bookingService from '../../../services/bookingService';

const FinalReview = ({ bookingData, setBookingData }) => {
  const [reservationNumber, setReservationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    createReservation();
  }, []);

  const createReservation = async () => {
    setLoading(true);
    setError('');

    try {
      // First create customer
      const customerData = {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phoneNumber: `+43${bookingData.phone}`,
      };

      const customer = await bookingService.createCustomer(customerData);

      // Then create reservation
      const reservationData = {
        roomId: bookingData.roomId,
        roomType: bookingData.roomType,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        customerId: customer._id,
      };

      const reservation = await bookingService.createReservation(reservationData);
      setReservationNumber(reservation.reservationNumber);
      
      // Update booking data with reservation info
      setBookingData(prev => ({ 
        ...prev, 
        reservationId: reservation._id,
        reservationNumber: reservation.reservationNumber 
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getGuestText = (count) => {
    return count === 1 ? 'Guest' : 'Guests';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-8 sm:py-12"
      >
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 mb-3 sm:mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">Creating your reservation...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 sm:py-12"
      >
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 sm:p-6">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Reservation Failed</h3>
          <p className="text-red-700 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 sm:space-y-8"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center"
      >
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#9962B9] flex items-center justify-center">
            {/* Inner circle */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#9962B9] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 sm:space-y-4"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Your Reservation is Confirmed!
        </h2>
        
        {/* Reservation Number */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-lg sm:text-xl text-gray-700">Reservation Number: {reservationNumber}</p>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto px-4"
      >
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          You can view the details on <Link to="/check" className="text-[#9962B9] font-medium">this page</Link>, 
          If you have any questions or need assistance, feel free to <span className="text-[#9962B9] font-medium">contact us</span>, 
          We can't wait to see you!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FinalReview;
