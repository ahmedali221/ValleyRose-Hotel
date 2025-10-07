import api from '../api/axiosConfig';

// Booking management service
export const bookingService = {
  // Get all bookings with pagination and filtering
  getBookings: async (params = {}) => {
    try {
      const response = await api.get('/offline-reservations', { params });
      // The backend returns { data: bookings, pagination: {...} }
      // Return the data array directly for compatibility with existing code
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Get all bookings with pagination info
  getBookingsWithPagination: async (params = {}) => {
    try {
      const response = await api.get('/offline-reservations', { params });
      // Return the full response including pagination info
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },
  
  // Get single booking by ID
  getBooking: async (id) => {
    try {
      const response = await api.get(`/offline-reservations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/offline-reservations', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },
  
  // Update booking
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await api.put(`/offline-reservations/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/offline-reservations/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking status');
    }
  },
  
  // Delete booking
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/offline-reservations/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete booking');
    }
  }
};
