import api from '../api/axiosConfig';

// Restaurant Main Menu service for fetching the restaurant PDF menu
export const restaurantMainMenuService = {
  /**
   * Get the restaurant main menu PDF
   * @returns {Promise<Object>} Object containing the PDF file URL and metadata
   */
  getMainMenu: async () => {
    try {
      const response = await api.get('/restaurant-main-menu');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch main menu');
    }
  },

  /**
   * Update the page count for the restaurant main menu
   * @param {number} pageCount - The correct number of pages
   * @returns {Promise<Object>} Updated menu data
   */
  updatePageCount: async (pageCount) => {
    try {
      const response = await api.put('/restaurant-main-menu/page-count', { pageCount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update page count');
    }
  },
};











