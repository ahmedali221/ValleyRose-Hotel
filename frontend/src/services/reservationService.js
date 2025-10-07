import axios from '../api/axiosConfig';

const reservationService = {
  // Search reservation by reservation number
  searchReservation: async (reservationNumber) => {
    try {
      // Ensure reservation number has # prefix
      const formattedReservationNumber = reservationNumber.startsWith('#') 
        ? reservationNumber 
        : `#${reservationNumber}`;
      
      const response = await axios.get(`/offline-reservations/search/${encodeURIComponent(formattedReservationNumber)}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Reservation not found. Please check your reservation code.');
      }
      throw new Error('Failed to search reservation. Please try again.');
    }
  },

  // Cancel reservation
  cancelReservation: async (reservationId) => {
    try {
      const response = await axios.patch(`/offline-reservations/public/${reservationId}/status`, {
        status: 'Cancelled'
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to cancel reservation. Please try again.');
    }
  }
};

export { reservationService };
