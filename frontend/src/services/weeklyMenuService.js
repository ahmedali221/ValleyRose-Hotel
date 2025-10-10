import api from '../api/axiosConfig';

// Weekly Menu service for fetching weekly menu data
export const weeklyMenuService = {
  /**
   * Get all weekly menu items for all days
   * @returns {Promise<Array>} Array of weekly menu items with populated meals and soups
   */
  getWeeklyMenu: async () => {
    try {
      const response = await api.get('/weekly-menu');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weekly menu');
    }
  },

  /**
   * Get weekly menu for a specific day
   * @param {string} day - Day of the week (e.g., 'Monday', 'Tuesday')
   * @returns {Promise<Object>} Weekly menu item for the specified day with populated meals and soups
   */
  getWeeklyMenuByDay: async (day) => {
    try {
      const response = await api.get(`/weekly-menu/${day}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || `Failed to fetch menu for ${day}`);
    }
  },
};











