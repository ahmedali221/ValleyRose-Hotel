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

  // Process payment (placeholder - integrate with actual payment service)
  processPayment: async (paymentData) => {
    try {
      // This would integrate with your payment provider (Stripe, PayPal, etc.)
      // For now, we'll simulate a successful payment
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount: paymentData.amount
      };
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }
};

export default bookingService;
