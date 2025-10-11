import api from '../api/axiosConfig';

// Settings service
export const settingsService = {
  // Admin management
  getAdmins: async () => {
    try {
      console.log('📡 SettingsService: Fetching admins...');
      const response = await api.get('/auth/admins');
      console.log('✅ SettingsService: Admins fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ SettingsService: Error fetching admins:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch admins';
      return { success: false, error: errorMessage };
    }
  },
  
  createAdmin: async (adminData) => {
    try {
      console.log('📡 SettingsService: Creating admin:', adminData.name);
      const response = await api.post('/auth/admins', adminData);
      console.log('✅ SettingsService: Admin created successfully');
      return { 
        success: true, 
        admin: response.data.admin,
        message: response.data.message 
      };
    } catch (error) {
      console.error('❌ SettingsService: Error creating admin:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create admin';
      return { success: false, error: errorMessage };
    }
  },
  
  deleteAdmin: async (adminId) => {
    try {
      console.log('📡 SettingsService: Deleting admin:', adminId);
      const response = await api.delete(`/auth/admins/${adminId}`);
      console.log('✅ SettingsService: Admin deleted successfully');
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('❌ SettingsService: Error deleting admin:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete admin';
      return { success: false, error: errorMessage };
    }
  },
  
  // Password management
  changePassword: async (passwordData) => {
    try {
      console.log('📡 SettingsService: Changing password...');
      const response = await api.put('/auth/change-password', passwordData);
      console.log('✅ SettingsService: Password changed successfully');
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('❌ SettingsService: Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      return { success: false, error: errorMessage };
    }
  },
  
  // General settings
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },
  
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};
