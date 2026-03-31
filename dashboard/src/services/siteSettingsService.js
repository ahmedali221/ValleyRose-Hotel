import api from '../api/axiosConfig';

export const siteSettingsService = {
  getSettings: async () => {
    try {
      const response = await api.get('/site-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch site settings';
      return { success: false, error: errorMessage };
    }
  },

  updateSetting: async (key, formData) => {
    try {
      const response = await api.put(`/site-settings/${key}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating site setting ${key}:`, error);
      const errorMessage = error.response?.data?.message || `Failed to update site setting ${key}`;
      return { success: false, error: errorMessage };
    }
  }
};
