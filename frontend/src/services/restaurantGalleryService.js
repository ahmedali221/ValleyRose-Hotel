import api from '../api/axiosConfig';

// Restaurant Gallery service for fetching gallery images
export const restaurantGalleryService = {
  /**
   * Get all restaurant gallery images
   * @returns {Promise<Array>} Array of gallery images with image URL and caption
   */
  getGalleryImages: async () => {
    try {
      const response = await api.get('/restaurant-gallery');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch gallery images');
    }
  },
};



