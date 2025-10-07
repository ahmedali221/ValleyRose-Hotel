import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/Header/Vector.png';
import character from '../../assets/reservations/chracter.png';
import { reservationService } from '../../services/reservationService';

const CheckReservation = () => {
  const [reservationCode, setReservationCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!reservationCode.trim()) {
      setError('Please enter a reservation code');
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
    
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationService.cancelReservation(reservation._id);
        setReservation(null);
        setReservationCode('');
        alert('Reservation cancelled successfully');
      } catch (err) {
        alert('Failed to cancel reservation: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <motion.div 
      className="max-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
  

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Search Form */}
          <motion.div 
            className="space-y-8"
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
                className="text-4xl font-serif text-gray-800 mb-4" 
                style={{ fontFamily: 'serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Quick Access to Your Booking Details
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Welcome to our Reservation Check page! Simply enter your <strong>reservation code</strong> below to instantly access your booking details. We look forward to welcoming you soon!
              </motion.p>
              
              <motion.form 
                onSubmit={handleSearch} 
                className="flex gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.input
                  type="text"
                  value={reservationCode}
                  onChange={(e) => setReservationCode(e.target.value)}
                  placeholder="reservation code (e.g., 56421 or #56421)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </motion.button>
              </motion.form>

              {error && (
                <motion.div 
                  className="text-red-600 text-sm mb-4"
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
                className="text-3xl font-serif text-gray-800 mb-4" 
                style={{ fontFamily: 'serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Support
              </motion.h3>
              <motion.p 
                className="text-gray-600 text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                If you need any assistance or have questions, our support team is ready to help.
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
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">+43 1 20 43 969</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">support.valley@gmail.com</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Results or Illustration */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {reservation ? (
              /* Reservation Details */
              <motion.div 
                className="w-full max-w-md bg-purple-50 rounded-lg p-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img src={logo} alt="Valley Rose" className="h-8" />
                  <div>
                    <span className="text-gray-600">Reservation</span>
                    <span className="text-purple-600 font-semibold ml-2">{reservation.reservationNumber}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">{reservation.customer.firstName} {reservation.customer.lastName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email address:</span>
                    <span className="font-medium">{reservation.customer.email}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Number:</span>
                    <span className="font-medium">{reservation.customer.phoneNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium">{reservation.roomType}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Guests:</span>
                    <span className="font-medium">{reservation.numberOfGuests} Guests</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in Date:</span>
                    <span className="font-medium">{formatDate(reservation.checkInDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out Date:</span>
                    <span className="font-medium">{formatDate(reservation.checkOutDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium">{reservation.cost}€</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{reservation.paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === 'Confirmed' 
                        ? 'bg-green-500 text-white' 
                        : reservation.status === 'Cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {reservation.status === 'Confirmed' ? 'Successful' : reservation.status}
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleCancelReservation}
                  disabled={reservation.status === 'Cancelled'}
                  className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    reservation.status === 'Cancelled' 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {reservation.status === 'Cancelled' ? 'Reservation Cancelled' : 'Cancel Reservation'}
                </motion.button>
              </motion.div>
            ) : (
              /* Illustration */
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div 
                  className="mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={character} alt="Reservation Check" className="mx-auto max-w-xs" />
                </motion.div>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Welcome! To find your booking, please enter your reservation code in the search bar.
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
};

export default CheckReservation;
