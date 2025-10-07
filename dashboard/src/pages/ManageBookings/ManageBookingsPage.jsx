import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Search and filter states
  const [searchFilters, setSearchFilters] = useState({
    roomType: '',
    reservationCode: ''
  });
  
  // Status filter state
  const [activeStatusFilter, setActiveStatusFilter] = useState('all-bookings');
  
  // Cancel reservation states
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchFilters, currentMonth, currentYear, activeStatusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getBookings();
      const bookingData = response.data || response;
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (activeStatusFilter !== 'all-bookings') {
      if (activeStatusFilter === 'upcoming') {
        filtered = filtered.filter(booking => booking.status === 'Confirmed');
      } else if (activeStatusFilter === 'checked-out') {
        filtered = filtered.filter(booking => booking.status === 'CheckedIn');
      } else if (activeStatusFilter === 'canceled') {
        filtered = filtered.filter(booking => booking.status === 'Cancelled');
      }
    }

    // Filter by room type
    if (searchFilters.roomType) {
      filtered = filtered.filter(booking => 
        booking.roomType?.toLowerCase().includes(searchFilters.roomType.toLowerCase())
      );
    }

    // Filter by reservation code
    if (searchFilters.reservationCode) {
      filtered = filtered.filter(booking => 
        booking.reservationNumber?.toLowerCase().includes(searchFilters.reservationCode.toLowerCase())
      );
    }

    // Filter by month and year
    filtered = filtered.filter(booking => {
      const checkInDate = new Date(booking.checkInDate);
      return checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear;
    });

    setFilteredBookings(filtered);
  };

  const handleStatusFilterChange = (filter) => {
    const filterValue = filter.toLowerCase().replace(' ', '-');
    setActiveStatusFilter(filterValue);
  };

  const handleSearch = () => {
    filterBookings();
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
    setShowCancelConfirm(false);
  };

  const handleCancelReservation = async () => {
    if (!selectedBooking) return;
    
    try {
      setCancelLoading(true);
      await bookingService.updateBookingStatus(selectedBooking._id, 'Cancelled');
      
      // Update the selected booking status
      setSelectedBooking({
        ...selectedBooking,
        status: 'Cancelled'
      });
      
      // Update the booking in the bookings list
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === selectedBooking._id 
            ? { ...booking, status: 'Cancelled' }
            : booking
        )
      );
      
      setShowCancelConfirm(false);
      
      // Return to the bookings list after successful cancellation
      setTimeout(() => {
        setSelectedBooking(null);
      }, 1000); // Small delay to show the updated status
      
    } catch (error) {
      setError(error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const getCustomerInfo = (booking) => {
    if (booking.customerId) {
      return {
        name: `${booking.customerId.firstName || ''} ${booking.customerId.lastName || ''}`.trim() || 'Guest',
        email: booking.customerId.email || 'N/A',
        phone: booking.customerId.phoneNumber || booking.customerId.phone || 'N/A'
      };
    }
    return {
      name: 'Guest',
      email: 'N/A',
      phone: 'N/A'
    };
  };

  const getRoomInfo = (booking) => {
    if (booking.roomId) {
      return {
        type: booking.roomId.title?.english || booking.roomId.type || booking.roomType || 'Room',
        price: booking.roomId.pricePerNight ? `${booking.roomId.pricePerNight}€` : '120€'
      };
    }
    return {
      type: booking.roomType || 'Room',
      price: '120€'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'CheckedIn':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'CheckedIn':
        return 'Successful';
      case 'Confirmed':
        return 'Confirmed';
      case 'Cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const canCancelReservation = (booking) => {
    // Can only cancel if status is 'Confirmed' and check-in date is in the future
    if (booking.status !== 'Confirmed') return false;
    
    const today = new Date();
    const checkInDate = new Date(booking.checkInDate);
    
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);
    
    return checkInDate > today;
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isToday = isCurrentMonth && today.getDate() === day;
      const hasBooking = filteredBookings.some(booking => {
        const checkIn = new Date(booking.checkInDate);
        return checkIn.getDate() === day;
      });
      
      return {
        day,
        isToday,
        hasBooking
      };
    });
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Booking Detail View
  if (selectedBooking) {
    const customer = getCustomerInfo(selectedBooking);
    const room = getRoomInfo(selectedBooking);
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={handleBackToList}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Manage Bookings
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Reservation Number */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-700">{selectedBooking.reservationNumber}</h2>
          </div>

          {/* Customer and Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg text-gray-900">{customer.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email address</label>
                <p className="text-lg text-gray-900">{customer.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-lg text-gray-900">{customer.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Room Type</label>
                <p className="text-lg text-gray-900">{room.type}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Number of Guests</label>
                <p className="text-lg text-gray-900">{selectedBooking.numberOfGuests} Guests</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Check-in Date</label>
                <p className="text-lg text-gray-900">{formatDate(selectedBooking.checkInDate)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Check-out Date</label>
                <p className="text-lg text-gray-900">{formatDate(selectedBooking.checkOutDate)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Cost</label>
                <p className="text-lg text-gray-900">{room.price}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Method</label>
                <p className="text-lg text-gray-900">Credit Card (Visa)</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusLabel(selectedBooking.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-12 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send Email
            </button>
            {canCancelReservation(selectedBooking) ? (
              <button 
                onClick={() => setShowCancelConfirm(true)}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Reservation
              </button>
            ) : (
              <button 
                disabled
                className="px-8 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                title={
                  selectedBooking.status === 'Cancelled' 
                    ? 'Reservation already cancelled'
                    : selectedBooking.status === 'CheckedIn'
                    ? 'Cannot cancel - guest has already checked in'
                    : 'Cannot cancel - check-in date has passed'
                }
              >
                {selectedBooking.status === 'Cancelled' ? 'Already Cancelled' : 'Cannot Cancel'}
              </button>
            )}
          </div>
        </div>

        {/* Cancellation Confirmation Dialog */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Reservation</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to cancel reservation <strong>{selectedBooking?.reservationNumber}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={cancelLoading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Keep Reservation
                  </button>
                  <button 
                    onClick={handleCancelReservation}
                    disabled={cancelLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Cancel Reservation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">© 2022-2025 by ValleyRose.com, Inc.</p>
        </div>
      </div>
    );
  }

  // Main Booking List View
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Bookings</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Status Filter Tabs */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-4 h-6 bg-purple-600 rounded-sm mr-3"></div>
            <h2 className="text-lg font-semibold text-gray-900">Filter by Status</h2>
          </div>
          <div className="flex space-x-4">
            {['All Bookings', 'Upcoming', 'Checked Out', 'Canceled'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleStatusFilterChange(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeStatusFilter === filter.toLowerCase().replace(' ', '-')
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

         {/* Search Section */}
         <div className="mb-8">
           <div className="flex items-center mb-6">
             <div className="w-4 h-6 bg-purple-600 rounded-sm mr-3"></div>
             <h2 className="text-lg font-semibold text-gray-900">Searching</h2>
           </div>
           
           <div className="flex items-end gap-4">
             {/* Room Type */}
             <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
               <select 
                 value={searchFilters.roomType}
                 onChange={(e) => setSearchFilters({...searchFilters, roomType: e.target.value})}
                 className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
               >
                 <option value="">Single</option>
                 <option value="Single Room">Single Room</option>
                 <option value="Double Room">Double Room</option>
                 <option value="Triple Room">Triple Room</option>
                 <option value="Apartment">Apartment</option>
                 <option value="Suite">Suite</option>
               </select>
             </div>

             {/* OR Text */}
             <div className="flex items-center pb-3">
               <span className="text-gray-400 text-sm font-medium">or</span>
             </div>

             {/* Reservation Code */}
             <div className="flex-1">
               <input
                 type="text"
                 placeholder="reservation code"
                 value={searchFilters.reservationCode}
                 onChange={(e) => setSearchFilters({...searchFilters, reservationCode: e.target.value})}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
               />
             </div>

             {/* Search Button */}
             <div>
               <button 
                 onClick={handleSearch}
                 className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
               >
                 Search
               </button>
             </div>
           </div>
         </div>

        {/* Calendar Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {months[currentMonth]} {currentYear}
            </h3>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-10 gap-2 mb-8">
          {generateCalendarDays().map(({ day, isToday, hasBooking }) => (
            <button
              key={day}
              className={`
                w-12 h-12 rounded-lg text-sm font-medium transition-colors
                ${isToday ? 'bg-green-500 text-white' : 
                  hasBooking ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found for the selected criteria</p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const customer = getCustomerInfo(booking);
              
              return (
                <div 
                  key={booking._id}
                  onClick={() => handleBookingClick(booking)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-700">
                      {booking.reservationNumber}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{customer.name}</h4>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Check-in: {formatDate(booking.checkInDate)}</p>
                      <p className="text-sm text-gray-600">Check-out: {formatDate(booking.checkOutDate)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-gray-500">© 2022-2025 by ValleyRose.com, Inc.</p>
      </div>
    </div>
  );
};

export default ManageBookingsPage;