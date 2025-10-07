import api from '../api/axiosConfig';

// Restaurant service for restaurant management
export const restaurantService = {
  // Get restaurant gallery images
  getGalleryImages: async () => {
    try {
      const response = await api.get('/restaurant-gallery');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch gallery images');
    }
  },

  // Upload multiple gallery images (uploads sequentially to match single-file backend)
  uploadGalleryImages: async (images) => {
    try {
      const uploaded = [];
      for (const image of images) {
        const formData = new FormData();
        formData.append('image', image);
        const response = await api.post('/restaurant-gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push(response.data);
      }
      return uploaded;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload gallery images');
    }
  },

  // Delete gallery image
  deleteGalleryImage: async (imageId) => {
    try {
      const response = await api.delete(`/restaurant-gallery/${imageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete gallery image');
    }
  },

  // Upload main menu PDF
  uploadMainMenu: async (file) => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await api.post('/restaurant-main-menu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload main menu');
    }
  },

  // Get main menu
  getMainMenu: async () => {
    try {
      const response = await api.get('/restaurant-main-menu');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch main menu');
    }
  },

  // Delete main menu
  deleteMainMenu: async () => {
    try {
      const response = await api.delete('/restaurant-main-menu');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete main menu');
    }
  },

  // Get weekly menu
  getWeeklyMenu: async () => {
    try {
      const response = await api.get('/weekly-menu');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weekly menu');
    }
  },

  // Update weekly menu
  updateWeeklyMenu: async (menuData) => {
    try {
      const response = await api.put('/weekly-menu', menuData);
      return response.data;
    } catch (error) {
      console.error('Update weekly menu error:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update weekly menu';
      throw new Error(errorMsg);
    }
  },

  // Get recommendations
  getRecommendations: async () => {
    try {
      const response = await api.get('/restaurant/recommendations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  },

  // Create recommendation
  createRecommendation: async (recommendationData) => {
    try {
      const formData = new FormData();
      formData.append('title', recommendationData.title);
      formData.append('description', recommendationData.description);
      if (recommendationData.thumbnail) {
        formData.append('thumbnail', recommendationData.thumbnail);
      }

      const response = await api.post('/restaurant/recommendations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create recommendation');
    }
  },

  // Update recommendation
  updateRecommendation: async (id, recommendationData) => {
    try {
      const formData = new FormData();
      formData.append('title', recommendationData.title);
      formData.append('description', recommendationData.description);
      if (recommendationData.thumbnail) {
        formData.append('thumbnail', recommendationData.thumbnail);
      }

      const response = await api.put(`/restaurant/recommendations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update recommendation');
    }
  },

  // Delete recommendation
  deleteRecommendation: async (id) => {
    try {
      const response = await api.delete(`/restaurant/recommendations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete recommendation');
    }
  }
};

// Meal endpoints (recommendations are meals with isRecommended=true)
export const mealService = {
  // List meals; supports filters
  listMeals: async (params = {}) => {
    try {
      const response = await api.get('/meals', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch meals');
    }
  },

  // Create a meal
  createMeal: async (data) => {
    try {
      const response = await api.post('/meals', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create meal');
    }
  },

  // Toggle recommended flag
  toggleRecommended: async (id) => {
    try {
      const response = await api.patch(`/meals/${id}/toggle-recommended`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update recommendation');
    }
  },

  // Delete a meal
  deleteMeal: async (id) => {
    try {
      const response = await api.delete(`/meals/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete meal');
    }
  },
};