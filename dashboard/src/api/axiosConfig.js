import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://valley-rose-hotel-git-main-ahmed-alis-projects-588ffe47.vercel.app/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Don't add token for public auth endpoints (login, register only)
    const isPublicAuthEndpoint = config.url?.includes('/auth/login') || 
                                config.url?.includes('/auth/register') ||
                                config.url?.endsWith('/login') ||
                                config.url?.endsWith('/register');
    
    if (!isPublicAuthEndpoint) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors appropriately
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      const requestUrl = error.config?.url || '';
      
      // Only logout for specific authentication errors, not general 401s
      const isAuthEndpoint = requestUrl.includes('/auth/');
      const isTokenError = errorMessage.includes('token') || 
                          errorMessage.includes('expired') || 
                          errorMessage.includes('invalid') ||
                          errorMessage.includes('unauthorized');
      
      // Only logout if it's an auth endpoint OR a clear token-related error
      if (isAuthEndpoint || isTokenError) {
        console.warn('🔐 Authentication error detected, logging out user:', errorMessage);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        // For other 401s, just log the error without logging out
        console.warn('⚠️ 401 error on non-auth endpoint, not logging out:', requestUrl, errorMessage);
      }
    } else if (error.response?.status >= 500) {
      // Server errors - don't logout, just log
      console.error('🚨 Server error:', error.response?.status, error.response?.data?.message);
    } else if (!error.response) {
      // Network errors - don't logout, just log
      console.error('🌐 Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
