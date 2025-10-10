import React, { useEffect, useState } from 'react';
import { offlineReservationService } from '../../services/offlineReservationService';

const OfflineReservationPage = () => {
  const [view, setView] = useState('create'); // 'create' or 'manage'
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  
  // Reservations management state
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, total: 1, count: 0, totalItems: 0 });
  const [statusFilter, setStatusFilter] = useState('');

  const [form, setForm] = useState({
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    customerId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [customerList, roomTypesList] = await Promise.all([
          offlineReservationService.listCustomers(),
          offlineReservationService.getRoomTypes()
        ]);
        
        setCustomers(Array.isArray(customerList) ? customerList : (customerList?.data ?? []));
        setRoomTypes(roomTypesList || []);
        
        // Set default room type if available
        if (roomTypesList && roomTypesList.length > 0) {
          setForm(prev => ({ ...prev, roomType: roomTypesList[0] }));
        }
      } catch (e) {
        console.error('Failed to load initial data:', e);
        setError('Failed to load room types and customers');
      }
    };
    loadInitialData();
  }, []);

  // Load reservations when view changes to manage
  useEffect(() => {
    if (view === 'manage') {
      loadReservations();
    }
  }, [view, statusFilter, pagination.current]);

  const loadReservations = async () => {
    setReservationsLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      };
      const response = await offlineReservationService.listReservations(params);
      console.log('Reservations response:', response);
      setReservations(response.data || []);
      setPagination(response.pagination || { current: 1, total: 1, count: 0, totalItems: 0 });
    } catch (e) {
      console.error('Failed to load reservations:', e);
      setError('Failed to load reservations');
    } finally {
      setReservationsLoading(false);
    }
  };

  // Reset availability when form criteria changes
  useEffect(() => {
    setAvailabilityChecked(false);
    setAvailableRooms([]);
  }, [form.roomType, form.checkInDate, form.checkOutDate]);

  const handleCheckAvailability = async () => {
    if (!form.roomType || !form.checkInDate || !form.checkOutDate) {
      setError('Please select room type, check-in date, and check-out date');
      return;
    }

    if (new Date(form.checkInDate) >= new Date(form.checkOutDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    if (new Date(form.checkInDate) < new Date().setHours(0, 0, 0, 0)) {
      setError('Check-in date cannot be in the past');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await offlineReservationService.checkAvailability(
        form.roomType,
        form.checkInDate,
        form.checkOutDate
      );
      
      setAvailableRooms(result.availableRooms || []);
      setAvailabilityChecked(true);
      
      if (result.availableCount === 0) {
        setError('No rooms available for the selected dates and room type');
      }
    } catch (e) {
      setError(e.message);
      setAvailabilityChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomerIfNeeded = async () => {
    if (form.customerId) return form.customerId;
    const created = await offlineReservationService.createCustomer({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phone,
    });
    return created._id;
  };

  const submitReservation = async () => {
    if (availableRooms.length === 0) {
      setError('No available rooms to reserve');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const customerId = await handleCreateCustomerIfNeeded();
      
      // Select the first available room
      const selectedRoom = availableRooms[0];
      
      const payload = {
        roomId: selectedRoom._id,
        roomType: form.roomType,
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        customerId,
        numberOfGuests: Number(form.numberOfGuests) || 1,
      };
      
      const created = await offlineReservationService.createOfflineReservation(payload);
      setSuccess(created);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSuccess(null);
    setError('');
    setAvailabilityChecked(false);
    setAvailableRooms([]);
    setForm({
      roomType: roomTypes.length > 0 ? roomTypes[0] : '',
      checkInDate: '',
      checkOutDate: '',
      customerId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      numberOfGuests: 1,
    });
  };

  // Reservation management functions
  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await offlineReservationService.updateReservationStatus(reservationId, newStatus);
      loadReservations(); // Reload the list
    } catch (e) {
      console.error('Failed to update status:', e);
      setError('Failed to update reservation status');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await offlineReservationService.deleteReservation(reservationId);
        loadReservations(); // Reload the list
      } catch (e) {
        console.error('Failed to delete reservation:', e);
        setError('Failed to delete reservation');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'CheckedIn': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canProceedToStep2 = availabilityChecked && availableRooms.length > 0;

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className={`w-full ${view === 'manage' ? 'max-w-6xl' : 'max-w-md'}`}>
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold valley-rose-text title-font mb-4">Offline Room Reservations</h1>
              
              {/* View Toggle */}
              {/* <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setView('create')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'create' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={view === 'create' ? {color: 'var(--primary-color)'} : {}}
                >
                  Create Reservation
                </button>
                <button
                  onClick={() => setView('manage')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'manage' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={view === 'manage' ? {color: 'var(--primary-color)'} : {}}
                >
                  Manage Reservations
                </button>
              </div> */}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Create Reservation View */}
            {view === 'create' && (
              <>
                {/* Step 1: Room Selection and Availability Check */}
                {step === 1 && (
              <div className="space-y-6">
                {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select 
                    value={form.roomType} 
                    onChange={(e) => setForm({ ...form, roomType: e.target.value })} 
                    className="w-full px-4 py-3 text-white rounded-lg focus:outline-none focus:ring-2 appearance-none"
                    style={{backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)'}}
                  >
                    {roomTypes.length === 0 ? (
                      <option value="" disabled>Loading room types...</option>
                    ) : (
                      roomTypes.map((roomType) => (
                        <option 
                          key={roomType} 
                          value={roomType}
                          className="bg-white text-black"
                        >
                          {roomType}
                        </option>
                      ))
                    )}
              </select>
            </div>
                
                {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={form.checkInDate} 
                      onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 pl-12"
                      style={{
                        '--tw-ring-color': 'var(--primary-color)',
                        colorScheme: 'light'
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      placeholder="dd / mm / yyyy"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: 'var(--primary-color)'}}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
              </div>

                {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={form.checkOutDate} 
                      onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 pl-12"
                      style={{
                        '--tw-ring-color': 'var(--primary-color)',
                        colorScheme: 'light'
                      }}
                      min={form.checkInDate || new Date().toISOString().split('T')[0]}
                      placeholder="dd / mm / yyyy"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: 'var(--primary-color)'}}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
              </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={handleCheckAvailability}
                    disabled={loading || !form.roomType || !form.checkInDate || !form.checkOutDate}
                    className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg disabled:cursor-not-allowed"
                  >
                    {loading ? 'Checking...' : 'Check Availability'}
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="flex-1 px-6 py-3 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    style={!canProceedToStep2 ? {} : {backgroundColor: 'var(--primary-color)'}}
                    onMouseEnter={(e) => {
                      if (!canProceedToStep2) return;
                      e.target.style.backgroundColor = 'var(--primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!canProceedToStep2) return;
                      e.target.style.backgroundColor = 'var(--primary-color)';
                    }}
                  >
                    Next
                  </button>
          </div>
        </div>
      )}

            {/* Step 2: Customer Details */}
      {step === 2 && (
              <div className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                    <input 
                      value={form.firstName} 
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="First name"
                    />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second name</label>
                    <input 
                      value={form.lastName} 
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="Second name"
                    />
                  </div>
            </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address <span className="text-gray-400 text-xs">( Confirmation email sent to this address )</span>
                  </label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="example@example.com"
                  />
            </div>

                {/* Phone and Guests */}
                <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="+43  Phone Number"
                    />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={form.numberOfGuests} 
                      onChange={(e) => setForm({ ...form, numberOfGuests: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="Number of Guests"
                    />
            </div>
          </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Check Availability
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!form.firstName || !form.lastName || !form.email || !form.phone}
                    className="flex-1 px-6 py-3 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    style={{backgroundColor: 'var(--primary-color)'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-color)';
                    }}
                  >
                    Next
                  </button>
          </div>
        </div>
      )}

            {/* Step 3: Confirmation */}
      {step === 3 && (
              <div className="space-y-6">
                {/* Reservation Summary */}
                <div className="content-section-light p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="text-gray-900">{form.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900">{new Date(form.checkInDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900">{new Date(form.checkOutDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest:</span>
                      <span className="text-gray-900">{form.firstName} {form.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="text-gray-900">{form.numberOfGuests}</span>
                    </div>
                  </div>
          </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(2)} 
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Check Availability
                  </button>
                  <button 
                    disabled={loading} 
                    onClick={submitReservation} 
                    className="flex-1 px-6 py-3 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    style={{backgroundColor: 'var(--primary-color)'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-color)';
                    }}
                  >
                    {loading ? 'Creating...' : 'Next'}
                  </button>
          </div>
        </div>
      )}

            {/* Step 4: Success */}
      {step === 4 && success && (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>

                {/* Success Message */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reservation is Confirmed!</h2>
                  <p className="text-gray-600">
                    Reservation Number : <span className="text-purple-600 font-semibold">{success.reservationNumber}</span>
                  </p>
                </div>

                {/* Done Button */}
                <button 
                  onClick={resetForm} 
                  className="w-full px-8 py-3 text-white rounded-lg"
                  style={{backgroundColor: 'var(--primary-color)'}}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--primary-color)';
                  }}
                >
                  Done
                </button>
              </div>
            )}
              </>
            )}

            {view === 'manage' && (
              <div>
                {/* Filters */}
                <div className="mb-6 flex gap-4 items-center">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="CheckedIn">Checked In</option>
                  </select>
                  
                  <button
                    onClick={loadReservations}
                    disabled={reservationsLoading}
                    className="px-4 py-2 text-white rounded-lg disabled:opacity-50"
                    style={{backgroundColor: 'var(--primary-color)'}}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--primary-color)';
                    }}
                  >
                    {reservationsLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {/* Reservations Table */}
                <div className="content-section-heavy rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reservation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Room & Dates
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cost
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation) => (
                          <tr key={reservation._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.reservationNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(reservation.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.customerId?.firstName} {reservation.customerId?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.customerId?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.roomType}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.numberOfGuests} guests
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.cost ? `${reservation.cost}€` : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.nights ? `${reservation.nights} nights` : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                {reservation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {reservation.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleStatusChange(reservation._id, 'Cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              )}
                              {reservation.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleStatusChange(reservation._id, 'CheckedIn')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Check In
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReservation(reservation._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination.total > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                          disabled={pagination.current === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                          disabled={pagination.current === pagination.total}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((pagination.current - 1) * 10) + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(pagination.current * 10, pagination.totalItems)}</span> of{' '}
                            <span className="font-medium">{pagination.totalItems}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                              disabled={pagination.current === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                              disabled={pagination.current === pagination.total}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">© 2022-2025 by ValleyRose.com, Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineReservationPage;