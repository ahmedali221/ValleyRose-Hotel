import api from '../api/axiosConfig';

const appSettingsService = {
  getSettings: async () => {
    const response = await api.get('/app-settings');
    return response.data.data;
  },

  updateSetting: async (key, value) => {
    const response = await api.put(`/app-settings/${key}`, { value });
    return response.data;
  },
};

export default appSettingsService;
