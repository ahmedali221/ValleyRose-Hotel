import api from '../api/axiosConfig';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 AuthService: Attempting login for:', credentials.email);
      
      // Validate credentials before sending
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Make API call to backend
      const response = await api.post('/auth/login', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      });

      console.log('📡 AuthService: Received response from backend');
      
      const { token, user } = response.data;
      
      // Validate response structure
      if (!token || !user) {
        throw new Error('Invalid response structure from server');
      }

      if (!user.id || !user.email) {
        throw new Error('Invalid user data received from server');
      }
      
      // Store authentication data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('✅ AuthService: Login successful for user:', user.email);
      console.log('💾 AuthService: Token and user data stored in localStorage');
      
      return { 
        success: true, 
        user, 
        token,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('❌ AuthService: Login failed:', error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message;
        
        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = serverMessage || 'Invalid email or password.';
            break;
          case 403:
            errorMessage = 'Access denied. Please contact administrator.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = serverMessage || `Server error (${status}). Please try again.`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  },

  // Logout user
  logout: () => {
    console.log('🚪 AuthService: Logging out user');
    
    // Clear stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear axios default authorization header
    delete api.defaults.headers.common['Authorization'];
    
    console.log('✅ AuthService: User logged out, redirecting to login');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Validate user object structure
      if (!user.id || !user.email) {
        console.warn('⚠️ AuthService: Invalid user data in localStorage, clearing...');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('❌ AuthService: Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    // Both token and user must exist
    if (!token || !user) {
      return false;
    }
    
    try {
      // Validate user data structure
      const userData = JSON.parse(user);
      return !!(userData.id && userData.email);
    } catch (error) {
      console.error('❌ AuthService: Error validating authentication:', error);
      return false;
    }
  },

  // Register user (if needed)
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // Refresh token (if needed)
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return { success: true, token };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Token refresh failed' 
      };
    }
  }
};
