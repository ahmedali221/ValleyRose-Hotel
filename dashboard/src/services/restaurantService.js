import api from '../api/axiosConfig';

// Restaurant service for restaurant management
export const restaurantService = {
  // Get restaurant gallery images
  getGalleryImages: async () => {
    try {
      const response = await api.get('/restaurant-gallery');
      return response.data;
    } catch (error) {
      // Handle 404 as "no gallery images" rather than an error
      if (error.response?.status === 404) {
        console.log('ℹ️ No restaurant gallery images found');
        return []; // Return empty array instead of throwing error
      }
      
      // Handle network errors or server errors
      if (!error.response) {
        console.warn('🌐 Network error fetching gallery images:', error.message);
        throw new Error('Network error. Please check your connection.');
      }
      
      // Handle other HTTP errors
      console.error('❌ Gallery fetch error:', error.response?.status, error.response?.data?.message);
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
      // Handle 404 as "no menu available" rather than an error
      if (error.response?.status === 404) {
        console.log('ℹ️ No restaurant main menu found');
        return null; // Return null instead of throwing error
      }
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

  // Update page count for main menu
  updatePageCount: async (pageCount) => {
    try {
      const response = await api.put('/restaurant-main-menu/page-count', { pageCount });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update page count');
    }
  },

  // Get weekly menu
  getWeeklyMenu: async () => {
    try {
      const response = await api.get('/weekly-menu');
      return response.data;
    } catch (error) {
      // Handle 404 as "no weekly menu" rather than an error
      if (error.response?.status === 404) {
        console.log('ℹ️ No weekly menu found');
        return null; // Return null instead of throwing error
      }
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

  // Add meal to specific day
  addMealToDay: async (day, mealId, type = 'meals') => {
    try {
      const response = await api.post(`/weekly-menu/${day}/add-meal`, {
        mealId,
        type,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add meal to day');
    }
  },

  // Remove meal from specific day
  removeMealFromDay: async (day, mealId, type = 'meals') => {
    try {
      const response = await api.post(`/weekly-menu/${day}/remove-meal`, {
        mealId,
        type,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove meal from day');
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