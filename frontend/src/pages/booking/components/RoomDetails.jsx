import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bookingService from '../../../services/bookingService';
import { useTranslation } from '../../../locales';

const RoomDetails = ({ onNext, bookingData, setBookingData, isRoomTypePreSelected = false }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState('');
  const [cost, setCost] = useState(0);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkInRef.current && !checkInRef.current.contains(event.target)) {
        setShowCheckInPicker(false);
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target)) {
        setShowCheckOutPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const types = await bookingService.getRoomTypes();
      // Ensure types is always an array
      setRoomTypes(Array.isArray(types) ? types : []);
    } catch (err) {
      console.error('Failed to fetch room types:', err);
      // Set default room types if API fails
      setRoomTypes(['Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite']);
    }
  };

  const handleSearch = async () => {
    if (!bookingData.roomType || !bookingData.checkInDate || !bookingData.checkOutDate) {
      setError(t('booking.pleaseFillAll'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const availability = await bookingService.checkAvailability(
        bookingData.roomType,
        bookingData.checkInDate,
        bookingData.checkOutDate
      );
      
      setIsAvailable(availability.available);
      setCost(availability.cost || 120); // Default cost if not provided
      setAvailabilityChecked(true);
      
      // Store roomId for reservation creation
      if (availability.available && availability.roomId) {
        setBookingData(prev => ({ ...prev, roomId: availability.roomId }));
      }
    } catch (err) {
      setError(err.message);
      setIsAvailable(false);
      setAvailabilityChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!availabilityChecked || !isAvailable) {
      setError(t('booking.pleaseCheckAvailability'));
      return;
    }
    
    setBookingData(prev => ({ ...prev, cost }));
    onNext();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateDateOptions = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year from start
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const handleDateSelect = (date, type) => {
    const dateString = date.toISOString().split('T')[0];
    setBookingData(prev => ({ ...prev, [type]: dateString }));
    
    if (type === 'checkInDate') {
      setShowCheckInPicker(false);
    } else {
      setShowCheckOutPicker(false);
    }
  };

  const DatePicker = ({ isOpen, onClose, selectedDate, onSelect, minDate, label }) => {
    if (!isOpen) return null;

    const today = new Date();
    const min = minDate ? new Date(minDate) : today;
    const dates = generateDateOptions(min, new Date(today.getTime() + (365 * 24 * 60 * 60 * 1000)));

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 p-4 max-h-80 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600 mb-2">
          {[t('booking.days.sun'), t('booking.days.mon'), t('booking.days.tue'), t('booking.days.wed'), t('booking.days.thu'), t('booking.days.fri'), t('booking.days.sat')].map(day => (
            <div key={day} className="p-2 font-medium">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date, index) => {
            const isSelected = selectedDate === date.toISOString().split('T')[0];
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;
            
            return (
              <button
                key={index}
                onClick={() => !isPast && onSelect(date)}
                disabled={isPast}
                className={`p-2 text-sm rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isToday
                    ? 'bg-purple-100 text-purple-600 font-semibold'
                    : isPast
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Availability Banner */}
      {availabilityChecked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 ${
            isAvailable ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: isAvailable ? '#28B800' : '#FF3B30', // #FF3B30 is a strong red
              }}
            >
              {isAvailable ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span
              className="font-medium text-sm sm:text-base"
              style={{
                color: isAvailable ? '#28B800' : '#FF3B30',
              }}
            >
              {isAvailable ? t('booking.available') : t('booking.notAvailable')}
            </span>
          </div>
          {isAvailable && (
            <span className="text-[#28B800] font-semibold text-sm sm:text-base">{t('booking.cost')}: {cost}€</span>
          )}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm sm:text-base"
        >
          {error}
        </motion.div>
      )}

      {/* Room Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('booking.roomType')}
          {isRoomTypePreSelected && (
            <span className="text-xs sm:text-sm text-[#9962B9] ml-1 sm:ml-2">{t('booking.preSelected')}</span>
          )}
        </label>
         <select
           value={bookingData.roomType || ''}
           onChange={(e) => setBookingData(prev => ({ ...prev, roomType: e.target.value }))}
           disabled={isRoomTypePreSelected}
           className={`w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm sm:text-base ${
             isRoomTypePreSelected 
               ? 'bg-[#9962B9] cursor-not-allowed' 
               : 'bg-[#9962B9]'
           }`}
         >
           {Array.isArray(roomTypes) && roomTypes.map((type) => (
             <option 
               key={type} 
               value={type}
               className={bookingData.roomType === type ? 'bg-[#9962B9] text-white' : 'bg-white text-black'}
             >
               {type}
             </option>
           ))}
         </select>
        {isRoomTypePreSelected && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            {t('booking.preSelectedDescription')}
          </p>
        )}
      </div>

      {/* Check-in Date */}
      <div className="relative" ref={checkInRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('booking.checkInDate')}
        </label>
        <button
          type="button"
          onClick={() => {
            setShowCheckInPicker(!showCheckInPicker);
            setShowCheckOutPicker(false);
          }}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          <span className={bookingData.checkInDate ? 'text-gray-900' : 'text-gray-500'}>
            {bookingData.checkInDate ? formatDateForDisplay(bookingData.checkInDate) : t('booking.selectCheckIn')}
          </span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </button>
        
        <AnimatePresence>
          <DatePicker
            isOpen={showCheckInPicker}
            onClose={() => setShowCheckInPicker(false)}
            selectedDate={bookingData.checkInDate}
            onSelect={(date) => handleDateSelect(date, 'checkInDate')}
            minDate={new Date().toISOString().split('T')[0]}
            label={t('booking.selectCheckInDate')}
          />
        </AnimatePresence>
      </div>

      {/* Check-out Date */}
      <div className="relative" ref={checkOutRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('booking.checkOutDate')}
        </label>
        <button
          type="button"
          onClick={() => {
            setShowCheckOutPicker(!showCheckOutPicker);
            setShowCheckInPicker(false);
          }}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          <span className={bookingData.checkOutDate ? 'text-gray-900' : 'text-gray-500'}>
            {bookingData.checkOutDate ? formatDateForDisplay(bookingData.checkOutDate) : t('booking.selectCheckOut')}
          </span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </button>
        
        <AnimatePresence>
          <DatePicker
            isOpen={showCheckOutPicker}
            onClose={() => setShowCheckOutPicker(false)}
            selectedDate={bookingData.checkOutDate}
            onSelect={(date) => handleDateSelect(date, 'checkOutDate')}
            minDate={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
            label={t('booking.selectCheckOutDate')}
          />
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
        <button
          onClick={handleSearch}
          disabled={loading || !bookingData.roomType || !bookingData.checkInDate || !bookingData.checkOutDate}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          {loading ? t('booking.searching') : t('booking.search')}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!availabilityChecked || !isAvailable}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          {t('booking.next')}
        </button>
      </div>
    </motion.div>
  );
};

export default RoomDetails;
