import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';
import { Mail01Icon, CallIcon, MeetingRoomIcon, UserIcon, EuroIcon, CalendarCheckOut01Icon, CalendarCheckIn01Icon, Calendar03Icon, Hotel01Icon, UserMultiple02Icon, MoneyBag01Icon } from 'hugeicons-react';

const HomePage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state for recent bookings
  const [bookingsPagination, setBookingsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  });
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [analyticsData, bookingsData] = await Promise.all([
          homeService.getDashboardStats(),
          homeService.getRecentBookings(bookingsPagination.itemsPerPage, 1)
        ]);
        
        setAnalytics(analyticsData);
        setRecentBookings(bookingsData.data || []);
        setBookingsPagination(prev => ({
          ...prev,
          currentPage: bookingsData.pagination?.current || 1,
          totalPages: bookingsData.pagination?.total || 1,
          totalItems: bookingsData.pagination?.totalItems || 0
        }));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch bookings for specific page
  const fetchBookingsPage = async (page) => {
    try {
      setBookingsLoading(true);
      const bookingsData = await homeService.getRecentBookings(bookingsPagination.itemsPerPage, page);
      
      setRecentBookings(bookingsData.data || []);
      setBookingsPagination(prev => ({
        ...prev,
        currentPage: bookingsData.pagination?.current || page,
        totalPages: bookingsData.pagination?.total || 1,
        totalItems: bookingsData.pagination?.totalItems || 0
      }));
    } catch (err) {
      console.error('Error fetching bookings page:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= bookingsPagination.totalPages) {
      fetchBookingsPage(newPage);
    }
  };

  // Generate insights from analytics data
  const insights = analytics ? [
    {
      title: "Total Bookings",
      value: analytics.totalBookings?.toString() || "0",
      icon: <Calendar03Icon size={32} style={{color: 'var(--primary-color)'}} />,
      description: "See how many bookings have been made across all rooms."
    },
    {
      title: "Available Rooms",
      value: analytics.availableRooms?.toString() || "0",
      icon: <Hotel01Icon size={32} style={{color: 'var(--primary-color)'}} />,
      description: "how many rooms are still open for today's check-in."
    },
    {
      title: "Current Guests",
      value: analytics.currentGuests?.toString() || "0",
      icon: <UserMultiple02Icon size={32} style={{color: 'var(--primary-color)'}} />,
      description: "Track how many guests are currently staying at the hotel."
    },
    {
      title: "Total Earnings",
      value: `${analytics.totalEarnings || 0}`,
      icon: <EuroIcon size={32} style={{color: 'var(--primary-color)'}} />,
      description: "total revenue your hotel has made from all completed bookings."
    }
  ] : [];

  // Helper function to format booking data
  const formatBookingData = (booking) => {
    const statusMap = {
      'Confirmed': { label: 'Confirmed', color: 'bg-blue-500' },
      'Cancelled': { label: 'Cancelled', color: 'bg-red-500' },
      'CheckedIn': { label: 'Checked In', color: 'bg-green-500' }
    };

    const status = statusMap[booking.status] || { label: booking.status, color: 'bg-gray-500' };

    // Build full name from firstName and lastName
    const fullName = booking.customerId?.firstName && booking.customerId?.lastName 
      ? `${booking.customerId.firstName} ${booking.customerId.lastName}`.trim()
      : booking.customerId?.firstName || booking.customerId?.lastName || 'Unknown Guest';

    return {
      guestName: fullName,
      email: booking.customerId?.email || 'No email',
      phone: booking.customerId?.phoneNumber || 'No phone',
      roomType: booking.roomType || 'Unknown Room',
      guests: `${booking.numberOfGuests} Guest${booking.numberOfGuests > 1 ? 's' : ''}`,
      price: booking.roomId?.pricePerNight ? `€ ${booking.roomId.pricePerNight}` : 'N/A',
      checkIn: new Date(booking.checkInDate).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).toUpperCase(),
      checkOut: new Date(booking.checkOutDate).toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).toUpperCase(),
      status: status.label,
      statusColor: status.color,
      reservationNumber: booking.reservationNumber
    };
  };

  // Format the bookings data
  const formattedBookings = recentBookings.map(formatBookingData);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="content-section-heavy border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold valley-rose-text title-font">
            Welcome Back {user?.name || 'Mr.toni'}
          </h1>
          <div className="flex space-x-6">
            <a href="#hotel-insights" className="valley-rose-text hover:text-purple-800 font-medium">
              Hotel Insights
            </a>
            <a href="#recent-bookings" className="valley-rose-text hover:text-purple-800 font-medium">
              Recent Bookings
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="valley-rose-text hover:text-purple-800 font-medium"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="text-red-600 hover:text-red-800 font-medium">
              LogOut
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--primary-color)'}}></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* Hotel Insights Section */}
            <div id="hotel-insights" className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
                <h2 className="text-2xl font-bold text-gray-900">Hotel Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {insights.map((insight, index) => (
                  <div key={index} className="content-section-heavy p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold text-gray-900">{insight.value}</div>
                      <div>{insight.icon}</div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Bookings Section */}
            <div id="recent-bookings">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              </div>
              
              {formattedBookings.length === 0 && !bookingsLoading ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Bookings</h3>
                  <p className="text-gray-600">There are no recent bookings to display at the moment.</p>
                </div>
              ) : (
                <>
                  {/* Bookings Loading State */}
                  {bookingsLoading && (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--primary-color)'}}></div>
                      <span className="ml-3 text-gray-600">Loading bookings...</span>
                    </div>
                  )}
                  
                  {/* Bookings Grid */}
                  {!bookingsLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {formattedBookings.map((booking, index) => (
                        <div key={booking.reservationNumber || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
                          <span 
                            className="px-3 py-1 text-white text-xs font-medium absolute top-0 right-0"
                            style={{
                              backgroundColor: booking.statusColor === 'bg-blue-500' ? '#3B82F6' : 
                                              booking.statusColor === 'bg-green-500' ? '#28B800' : 
                                              booking.statusColor === 'bg-red-500' ? '#ED0000' : '#6B7280',
                              borderRadius: '0 8px 0 8px',
                              zIndex: 10
                            }}
                          >
                            {booking.status}
                          </span>
                          
                          {/* Customer Name */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{booking.guestName}</h3>
                          </div>
                          
                          {/* Contact Information */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-5">
                              <div className="flex items-center text-sm text-gray-600 space-x-2">
                                <Mail01Icon style={{color: 'var(--primary-color)', marginRight: '0.5rem'}} />
                                {booking.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <CallIcon style={{color: 'var(--primary-color)', marginRight: '0.5rem'}} />
                                {booking.phone}
                              </div>
                            </div>
                          </div>
                          
                          {/* Booking Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-5">
                              <div className="flex items-center text-sm text-gray-600">
                                <MeetingRoomIcon className="mr-2" style={{color: 'var(--primary-color)'}} />
                                {booking.roomType}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <UserIcon className="mr-2" style={{color: 'var(--primary-color)'}} />
                                {booking.guests}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <EuroIcon className="mr-2" style={{color: 'var(--primary-color)'}} />
                                {booking.price}
                              </div>
                            </div>
                          </div>
                          
                          {/* Reservation Number */}
                          <div className="mb-4">
                            <div className="text-sm text-gray-500">
                              {booking.reservationNumber}
                            </div>
                          </div>
                          
                          {/* Check-in/Check-out Dates */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-5">
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarCheckIn01Icon className="mr-2" style={{color: 'var(--primary-color)'}} />
                                Check-In: {booking.checkIn}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarCheckOut01Icon className="mr-2" style={{color: 'var(--primary-color)'}} />
                                Check-Out: {booking.checkOut}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination Controls */}
                  {!bookingsLoading && bookingsPagination.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {((bookingsPagination.currentPage - 1) * bookingsPagination.itemsPerPage) + 1} to{' '}
                        {Math.min(bookingsPagination.currentPage * bookingsPagination.itemsPerPage, bookingsPagination.totalItems)} of{' '}
                        {bookingsPagination.totalItems} bookings
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(bookingsPagination.currentPage - 1)}
                          disabled={bookingsPagination.currentPage === 1}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            bookingsPagination.currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, bookingsPagination.totalPages) }, (_, i) => {
                            let pageNum;
                            if (bookingsPagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (bookingsPagination.currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (bookingsPagination.currentPage >= bookingsPagination.totalPages - 2) {
                              pageNum = bookingsPagination.totalPages - 4 + i;
                            } else {
                              pageNum = bookingsPagination.currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  pageNum === bookingsPagination.currentPage
                                    ? 'bg-[var(--primary-color)] text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(bookingsPagination.currentPage + 1)}
                          disabled={bookingsPagination.currentPage === bookingsPagination.totalPages}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            bookingsPagination.currentPage === bookingsPagination.totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="content-section-heavy border-t border-gray-200 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2022-2025 by ValleyRose.com, Inc.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
