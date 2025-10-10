import api from '../api/axiosConfig';

// Home service for dashboard data
export const homeService = {
  // Get analytics data from backend
  getDashboardStats: async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent bookings/reservations with pagination
  getRecentBookings: async (limit = 6, page = 1) => {
    try {
      const response = await api.get(`/offline-reservations?limit=${limit}&page=${page}`);
      return response.data; // Returns full response with data and pagination info
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }
  }
};
