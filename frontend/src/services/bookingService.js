import api from '../api/axiosConfig';

const bookingService = {
  // Get available room types
  getRoomTypes: async () => {
    try {
      const response = await api.get('/rooms/types');
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      throw new Error('Failed to fetch room types');
    }
  },

  // Check room availability
  checkAvailability: async (roomType, checkInDate, checkOutDate) => {
    try {
      const response = await api.get('/offline-reservations/public/check-availability', {
        params: {
          roomType,
          checkInDate,
          checkOutDate
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Room not available for selected dates');
      }
      throw new Error('Failed to check room availability');
    }
  },

  // Create customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers/public', customerData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create customer');
    }
  },

  // Create reservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/offline-reservations/public', reservationData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Room not available for selected dates');
      }
      throw new Error('Failed to create reservation');
    }
  },

  // Fetch app-wide settings (e.g. check-in fee config)
  getAppSettings: async () => {
    try {
      const response = await api.get('/app-settings');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch app settings');
    }
  },

  // Create a Stripe PaymentIntent — returns { clientSecret, paymentIntentId }
  createPaymentIntent: async (intentData) => {
    try {
      const response = await api.post('/payments/create-intent', intentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  },

  // Confirm payment after Stripe processes the card — creates the Payment record in DB
  confirmPayment: async (confirmData) => {
    try {
      const response = await api.post('/payments/confirm', confirmData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  },

  // Cancel a PaymentIntent — called when user switches payment type to avoid orphaned intents
  cancelPaymentIntent: async (paymentIntentId) => {
    try {
      const response = await api.post('/payments/cancel-intent', { paymentIntentId });
      return response.data;
    } catch (error) {
      // Non-fatal — log and swallow so the user flow is never blocked by this
      console.warn('Failed to cancel PaymentIntent:', paymentIntentId, error.message);
      return { success: false };
    }
  },
};

export default bookingService;
