import React from 'react';
import { motion } from 'framer-motion';

const Confirmation = ({ onNext, onBack, bookingData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getGuestText = (count) => {
    return count === 1 ? 'Guest' : 'Guests';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Confirmation Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reservation Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-800">
              {bookingData.firstName} {bookingData.lastName}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Email address:</span>
            <span className="font-medium text-gray-800">{bookingData.email}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Phone Number:</span>
            <span className="font-medium text-gray-800">+43 {bookingData.phone}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Room Type:</span>
            <span className="font-medium text-gray-800">{bookingData.roomType}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Number of Guests:</span>
            <span className="font-medium text-gray-800">
              {bookingData.numberOfGuests} {getGuestText(bookingData.numberOfGuests)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in Date:</span>
            <span className="font-medium text-gray-800">
              {formatDate(bookingData.checkInDate)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out Date:</span>
            <span className="font-medium text-gray-800">
              {formatDate(bookingData.checkOutDate)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Cost:</span>
            <span className="font-medium text-gray-800">{bookingData.cost}€</span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Important Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Please review all details carefully before proceeding to payment. 
              Any changes after payment confirmation may incur additional charges.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={onNext}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </motion.div>
  );
};

export default Confirmation;
