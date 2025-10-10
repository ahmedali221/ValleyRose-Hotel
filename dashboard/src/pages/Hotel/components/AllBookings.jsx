import React, { useState, useEffect } from 'react';
import { offlineReservationService } from '../../../services/offlineReservationService';
import { Mail01Icon,CallIcon,MeetingRoomIcon,UserIcon,EuroIcon,CalendarCheckOut01Icon,CalendarCheckIn01Icon  } from 'hugeicons-react';
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
      const response = await offlineReservationService.listReservations({ status: '', page: 1, limit: 1000 });
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
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try server-side filtering for specific status
      const response = await offlineReservationService.listReservations(filters);
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
      console.error('Failed to fetch reservations with server filtering:', error);
      
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
        return '#28B800';
      case 'CheckedIn':
        return '#28B800';
      case 'Cancelled':
        return '#ED0000';
      case 'Pending':
        return '#FFA500';
      default:
        return '#6B7280';
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

  const getCustomerInfo = (reservation) => {
    if (reservation.customerId) {
      return {
        name: `${reservation.customerId.firstName || ''} ${reservation.customerId.lastName || ''}`.trim() || 'Guest',
        email: reservation.customerId.email || 'N/A',
        phone: reservation.customerId.phoneNumber || reservation.customerId.phone || 'N/A'
      };
    }
    return {
      name: 'Guest',
      email: 'N/A',
      phone: 'N/A'
    };
  };

  const getRoomInfo = (reservation) => {
    if (reservation.roomId) {
      return {
        type: reservation.roomId.title?.english || reservation.roomId.type || reservation.roomType || 'Room',
        price: reservation.cost ? `€ ${reservation.cost}` : (reservation.roomId.pricePerNight ? `€ ${reservation.roomId.pricePerNight}` : 'N/A')
      };
    }
    return {
      type: reservation.roomType || 'Room',
      price: reservation.cost ? `€ ${reservation.cost}` : 'N/A'
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--primary-color)'}}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 text-white rounded-lg"
          style={{backgroundColor: 'var(--primary-color)'}}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--primary-color)';
          }}
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
                ? 'text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
            style={activeFilter === filter.toLowerCase().replace(' ', '-') ? {backgroundColor: 'var(--primary-color)'} : {}}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Reservation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {bookings.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No reservations found</p>
          </div>
        ) : (
          bookings.map((reservation) => {
            const customer = getCustomerInfo(reservation);
            const room = getRoomInfo(reservation);
            
            return (
              <div key={reservation._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
                <span 
                  className="px-3 py-1 text-white text-xs font-medium absolute top-0 right-0"
                  style={{
                    backgroundColor: getStatusColor(reservation.status),
                    borderRadius: '0 8px 0 8px',
                    zIndex: 10
                  }}
                >
                  {getStatusLabel(reservation.status)}
                </span>
                
                {/* Customer Name */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                </div>
                
                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-5">
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                    <Mail01Icon style={{color: 'var(--primary-color)', marginRight: '0.5rem'}} />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CallIcon style={{color: 'var(--primary-color)', marginRight: '0.5rem'}} />
                    {customer.phone}
                  </div>
                </div>
                </div>
                
                {/* Booking Details */}
                <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-5">
                <div className="flex items-center text-sm text-gray-600">
                    <MeetingRoomIcon className="mr-2" style={{color: 'var(--primary-color)'}} />
                    {room.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="mr-2" style={{color: 'var(--primary-color)'}} />
                    {reservation.numberOfGuests} Guests
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EuroIcon className="mr-2" style={{color: 'var(--primary-color)'}} />
                    {room.price}
                  </div>
                </div>

                
                </div>
                
                {/* Reservation Number */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500">
                    {reservation.reservationNumber}
                  </div>
                </div>
                
                {/* Check-in/Check-out Dates */}
                <div className="space-y-2">
                 <div className="flex items-center space-x-5">
                 <div className="flex items-center text-sm text-gray-600">
                    <CalendarCheckIn01Icon className="mr-2" style={{color: 'var(--primary-color)'}} />
                    Check-In: {formatDate(reservation.checkInDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarCheckOut01Icon className="mr-2" style={{color: 'var(--primary-color)'}} />
                    Check-Out: {formatDate(reservation.checkOutDate)}
                  </div>
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
                  ? 'text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
              style={page === pagination.current ? {backgroundColor: 'var(--primary-color)'} : {}}
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
