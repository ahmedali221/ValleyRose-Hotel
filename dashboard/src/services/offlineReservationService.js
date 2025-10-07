import api from '../api/axiosConfig';

// Offline reservation service
export const offlineReservationService = {
  // List rooms (optionally filter by type)
  listRooms: async (params = {}) => {
    try {
      const res = await api.get('/rooms', { params });
      return res.data;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to fetch rooms');
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
};
