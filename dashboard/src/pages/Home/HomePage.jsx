import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { homeService } from '../../services/homeService';

const HomePage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [analyticsData, bookingsData] = await Promise.all([
          homeService.getDashboardStats(),
          homeService.getRecentBookings(6)
        ]);
        
        setAnalytics(analyticsData);
        setRecentBookings(bookingsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate insights from analytics data
  const insights = analytics ? [
    {
      title: "Total Bookings",
      value: analytics.totalBookings?.toString() || "0",
      icon: "👤",
      description: "See how many bookings have been made across all rooms."
    },
    {
      title: "Available Rooms",
      value: analytics.availableRooms?.toString() || "0",
      icon: "📅",
      description: "how many rooms are still open for today's check-in."
    },
    {
      title: "Current Guests",
      value: analytics.currentGuests?.toString() || "0",
      icon: "👥",
      description: "Track how many guests are currently staying at the hotel."
    },
    {
      title: "Total Earnings",
      value: `${analytics.totalEarnings || 0}${analytics.currency === 'EUR' ? '€' : ''}`,
      icon: "💰",
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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back {user?.name || 'Mr.toni'}
          </h1>
          <div className="flex space-x-6">
            <a href="#hotel-insights" className="text-purple-600 hover:text-purple-800 font-medium">
              Hotel Insights
            </a>
            <a href="#recent-bookings" className="text-purple-600 hover:text-purple-800 font-medium">
              Recent Bookings
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="text-purple-600 hover:text-purple-800 font-medium"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        ) : (
          <>
            {/* Hotel Insights Section */}
            <div id="hotel-insights" className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">Hotel Insights</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {insights.map((insight, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold text-gray-900">{insight.value}</div>
                      <div className="text-2xl">{insight.icon}</div>
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
                <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              </div>
              
              {formattedBookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Bookings</h3>
                  <p className="text-gray-600">There are no recent bookings to display at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formattedBookings.map((booking, index) => (
                    <div key={booking.reservationNumber || index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.guestName}</h3>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${booking.statusColor}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📧</span>
                          {booking.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📞</span>
                          {booking.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🚪</span>
                          {booking.roomType}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">👤</span>
                          {booking.guests}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-bold text-gray-900">{booking.price}</div>
                        {booking.reservationNumber && (
                          <div className="text-xs text-gray-500">{booking.reservationNumber}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📅</span>
                          Check-In: {booking.checkIn}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📅</span>
                          Check-Out: {booking.checkOut}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          © 2022-2025 by ValleyRose.com, Inc.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
