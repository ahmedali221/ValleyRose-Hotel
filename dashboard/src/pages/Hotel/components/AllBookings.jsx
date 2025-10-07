import React, { useState, useEffect } from 'react';
import { bookingService } from '../../../services/bookingService';

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]); // Store all bookings
  const [bookings, setBookings] = useState([]); // Store filtered bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all-bookings');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalItems: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 6
  });

  // Initial load - fetch all bookings
  useEffect(() => {
    fetchAllBookingsInitially();
  }, []);

  // Fetch bookings when filters change
  useEffect(() => {
    if (filters.status === '') {
      // If no status filter, show all bookings with pagination
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedBookings = allBookings.slice(startIndex, endIndex);
      
      setBookings(paginatedBookings);
      setPagination({
        current: filters.page,
        total: Math.ceil(allBookings.length / filters.limit),
        count: paginatedBookings.length,
        totalItems: allBookings.length
      });
    } else {
      // Apply filtering
      fetchBookings();
    }
  }, [filters, allBookings]);

  const fetchAllBookingsInitially = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getBookings({ status: '', page: 1, limit: 1000 });
      const fetchedBookings = response.data || response;
      setAllBookings(Array.isArray(fetchedBookings) ? fetchedBookings : []);
      
      // Show first page initially
      const startIndex = 0;
      const endIndex = filters.limit;
      const paginatedBookings = (Array.isArray(fetchedBookings) ? fetchedBookings : []).slice(startIndex, endIndex);
      
      setBookings(paginatedBookings);
      setPagination({
        current: 1,
        total: Math.ceil((Array.isArray(fetchedBookings) ? fetchedBookings : []).length / filters.limit),
        count: paginatedBookings.length,
        totalItems: (Array.isArray(fetchedBookings) ? fetchedBookings : []).length
      });
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try server-side filtering for specific status
      const response = await bookingService.getBookings(filters);
      const fetchedBookings = response.data || response;
      
      setBookings(Array.isArray(fetchedBookings) ? fetchedBookings : []);
      
      // Handle pagination if available
      if (response.pagination) {
        setPagination(response.pagination);
      } else {
        // Fallback to client-side pagination if server doesn't provide it
        applyClientSideFiltering();
      }
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch bookings with server filtering:', error);
      
      // If server-side filtering fails, use client-side filtering
      if (allBookings.length > 0) {
        applyClientSideFiltering();
      }
    } finally {
      setLoading(false);
    }
  };

  const applyClientSideFiltering = () => {
    let filtered = [...allBookings];
    
    if (filters.status && filters.status.trim() !== '') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }
    
    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedBookings = filtered.slice(startIndex, endIndex);
    
    setBookings(paginatedBookings);
    setPagination({
      current: filters.page,
      total: Math.ceil(filtered.length / filters.limit),
      count: paginatedBookings.length,
      totalItems: filtered.length
    });
  };

  const handleFilterChange = (filter) => {
    const filterValue = filter.toLowerCase().replace(' ', '-');
    setActiveFilter(filterValue);
    
    let status = '';
    if (filterValue === 'upcoming') {
      status = 'Confirmed';
    } else if (filterValue === 'checked-out') {
      status = 'CheckedIn'; // Assuming CheckedIn means checked out
    } else if (filterValue === 'canceled') {
      status = 'Cancelled';
    }
    
    setFilters(prev => ({
      ...prev,
      status,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-500';
      case 'CheckedIn':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      case 'Pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'CheckedIn':
        return 'Checked Out';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).toUpperCase();
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
        type: booking.roomId.title?.english || booking.roomId.type || 'Room',
        price: booking.roomId.pricePerNight ? `€ ${booking.roomId.pricePerNight}` : 'N/A'
      };
    }
    return {
      type: booking.roomType || 'Room',
      price: 'N/A'
    };
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

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['All Bookings', 'Upcoming', 'Checked Out', 'Canceled'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.toLowerCase().replace(' ', '-')
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Booking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {bookings.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          bookings.map((booking) => {
            const customer = getCustomerInfo(booking);
            const room = getRoomInfo(booking);
            
            return (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-purple-600">
                    <span className="mr-2">📧</span>
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <span className="mr-2">📞</span>
                    {customer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🚪</span>
                    {room.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👤</span>
                    {booking.numberOfGuests} Guests
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-900">{room.price}</div>
                  <div className="text-sm text-gray-500">
                    #{booking.reservationNumber}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    Check-In: {formatDate(booking.checkInDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span>
                    Check-Out: {formatDate(booking.checkOutDate)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button 
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-gray-600">‹</span>
          </button>
          {Array.from({ length: pagination.total }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium ${
                page === pagination.current
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.total}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-gray-600">›</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
