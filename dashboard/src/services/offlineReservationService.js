import api from '../api/axiosConfig';

// Offline reservation service
export const offlineReservationService = {
  // Get room types
  getRoomTypes: async () => {
    try {
      const res = await api.get('/rooms/types');
      return res.data.data || [];
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to fetch room types');
    }
  },

  // List customers
  listCustomers: async () => {
    try {
      const res = await api.get('/customers');
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to fetch customers');
    }
  },

  // Create customer
  createCustomer: async (payload) => {
    try {
      const res = await api.post('/customers', payload);
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to create customer');
    }
  },

  // Check room availability
  checkAvailability: async (roomType, checkInDate, checkOutDate) => {
    try {
      const res = await api.get('/offline-reservations/check-availability', {
        params: {
          roomType,
          checkInDate,
          checkOutDate
        }
      });
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to check availability');
    }
  },

  // Create offline reservation
  createOfflineReservation: async (payload) => {
    try {
      const res = await api.post('/offline-reservations', payload);
      return res.data;
    } catch (e) {
      // bubble up 409 for unavailable
      const msg = e.response?.data?.message || 'Failed to create reservation';
      const status = e.response?.status;
      const err = new Error(msg);
      err.status = status;
      throw err;
    }
  },

  // List all reservations
  listReservations: async (params = {}) => {
    try {
      const res = await api.get('/offline-reservations', { params });
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to fetch reservations');
    }
  },

  // Get single reservation
  getReservation: async (id) => {
    try {
      const res = await api.get(`/offline-reservations/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to fetch reservation');
    }
  },

  // Update reservation status
  updateReservationStatus: async (id, status) => {
    try {
      const res = await api.patch(`/offline-reservations/${id}/status`, { status });
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to update reservation status');
    }
  },

  // Delete reservation
  deleteReservation: async (id) => {
    try {
      const res = await api.delete(`/offline-reservations/${id}`);
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to delete reservation');
    }
  },
};
