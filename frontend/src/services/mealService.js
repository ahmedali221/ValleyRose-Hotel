import api from '../api/axiosConfig';

// Meal service for fetching meals and recommendations
export const mealService = {
  /**
   * Get all meals with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.type - Filter by meal type ('Meal' or 'Soup')
   * @param {string} params.recommended - Filter by recommended status ('true' or 'false')
   * @returns {Promise<Array>} Array of meals
   */
  getMeals: async (params = {}) => {
    try {
      const response = await api.get('/meals', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch meals');
    }
  },

  /**
   * Get recommended meals only
   * @returns {Promise<Array>} Array of recommended meals
   */
  getRecommendedMeals: async () => {
    try {
      const response = await api.get('/meals', { 
        params: { recommended: 'true' } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recommended meals');
    }
  },

  /**
   * Get meals by type
   * @param {string} type - Meal type ('Meal' or 'Soup')
   * @returns {Promise<Array>} Array of meals of the specified type
   */
  getMealsByType: async (type) => {
    try {
      const response = await api.get('/meals', { 
        params: { type } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || `Failed to fetch ${type.toLowerCase()}s`);
    }
  },
};

