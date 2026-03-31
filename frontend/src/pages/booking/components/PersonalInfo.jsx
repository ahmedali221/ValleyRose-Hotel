import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../locales';

const PersonalInfo = ({ onNext, onBack, bookingData, setBookingData }) => {
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = {};

    if (!bookingData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!bookingData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!bookingData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!bookingData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!bookingData.numberOfGuests || bookingData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'Number of guests is required';
    }

    if (!bookingData.agreedToTerms) {
      newErrors.agreedToTerms = t('booking.termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* First Name and Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={bookingData.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="First name"
            className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={bookingData.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Last name"
            className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <p className="text-xs sm:text-sm text-gray-500 mb-2">Confirmation email sent to this address</p>
        <input
          type="email"
          value={bookingData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="example@example.com"
          className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {errors.email && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Phone Number and Number of Guests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="flex">
            <div className="px-2 sm:px-3 py-2 sm:py-3 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm sm:text-base">
              +43
            </div>
            <input
              type="tel"
              value={bookingData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Phone Number"
              className={`flex-1 p-2 sm:p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={bookingData.numberOfGuests || ''}
            onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value) || '')}
            placeholder="Number of Guests"
            className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-sm sm:text-base ${errors.numberOfGuests ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.numberOfGuests && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.numberOfGuests}</p>
          )}
        </div>
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="pt-2">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreedToTerms"
            checked={bookingData.agreedToTerms || false}
            onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
            className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
          />
          <label htmlFor="agreedToTerms" className="text-sm sm:text-base text-gray-700 cursor-pointer">
            {t('booking.agreeToTerms')}{' '}
            <Link
              to="/terms"
              target="_blank"
              className="text-purple-600 hover:text-purple-800 underline font-medium"
            >
              {t('booking.termsLink')}
            </Link>
          </label>
        </div>
        {errors.agreedToTerms && (
          <p className="mt-1 ml-7 text-xs sm:text-sm text-red-600">{errors.agreedToTerms}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default PersonalInfo;

