import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Payment = ({ onNext, onBack, bookingData, setBookingData }) => {
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData.cardNumber?.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(bookingData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!bookingData.expiryDate?.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(bookingData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    
    if (!bookingData.cvv?.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(bookingData.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    if (!bookingData.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with your payment provider
      const paymentResult = {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount: bookingData.cost
      };
      
      setBookingData(prev => ({ ...prev, paymentResult }));
      onNext();
    } catch (error) {
      setErrors({ payment: 'Payment processing failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Payment Summary</h3>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm sm:text-base">Room Type:</span>
            <span className="text-gray-800 text-sm sm:text-base">{bookingData.roomType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm sm:text-base">Check-in:</span>
            <span className="text-gray-800 text-sm sm:text-base">{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm sm:text-base">Check-out:</span>
            <span className="text-gray-800 text-sm sm:text-base">{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm sm:text-base">Nights:</span>
            <span className="text-gray-800 text-sm sm:text-base">
              {Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Total Amount:</span>
              <span className="text-lg sm:text-xl font-bold text-purple-600">{bookingData.cost}€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <input
          type="text"
          value={bookingData.cardNumber || ''}
          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${
            errors.cardNumber ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={bookingData.expiryDate || ''}
            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
            placeholder="MM/YY"
            maxLength="5"
            className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${
              errors.expiryDate ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={bookingData.cvv || ''}
            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
            placeholder="123"
            maxLength="4"
            className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${
              errors.cvv ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.cvv && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={bookingData.cardholderName || ''}
          onChange={(e) => handleInputChange('cardholderName', e.target.value)}
          placeholder="John Doe"
          className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${
            errors.cardholderName ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.cardholderName && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.cardholderName}</p>
        )}
      </div>

      {/* Payment Error */}
      {errors.payment && (
        <div className="p-3 sm:p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm sm:text-base">
          {errors.payment}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-green-800">Secure Payment</h4>
            <p className="text-xs sm:text-sm text-green-700 mt-1">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
        <button
          onClick={onBack}
          disabled={processing}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={processing}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          {processing && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{processing ? 'Processing...' : 'Proceed to Payment'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Payment;
