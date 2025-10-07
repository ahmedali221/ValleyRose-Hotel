import api from '../api/axiosConfig';

// Room service for fetching room data
export const roomService = {
  /**
   * Get all rooms with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {string} params.type - Filter by room type ('Single Room', 'Double Room', 'Triple Room', 'Apartment', 'Suite')
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @returns {Promise<Object>} Object containing rooms data and pagination info
   */
  getRooms: async (params = {}) => {
    try {
      const response = await api.get('/rooms', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },

  /**
   * Get a single room by ID
   * @param {string} id - Room ID
   * @returns {Promise<Object>} Room data
   */
  getRoomById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room details');
    }
  },

  /**
   * Get available room types
   * @returns {Promise<Object>} Object containing array of room types
   */
  getRoomTypes: async () => {
    try {
      const response = await api.get('/rooms/types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room types');
    }
  },

  /**
   * Get rooms by type
   * @param {string} type - Room type
   * @returns {Promise<Object>} Object containing filtered rooms and pagination info
   */
  getRoomsByType: async (type) => {
    try {
      const response = await api.get('/rooms', { 
        params: { type } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || `Failed to fetch ${type}s`);
    }
  },
};

