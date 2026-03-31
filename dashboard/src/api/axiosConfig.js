import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000, // 90 seconds timeout (increased for serverless cold starts)
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

// Helper function to retry requests
const retryRequest = async (config, retries = 2, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      return await api.request(config);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`🔄 Retrying request (${i + 1}/${retries})...`);
    }
  }
};

// Response interceptor to handle auth errors and retry logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Handle timeout errors and 500 errors with retry (more aggressive for /meals endpoint)
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const isServerError = error.response?.status >= 500;
    const isConnectionError = !error.response && error.code !== 'ECONNABORTED';
    const isMealsEndpoint = config.url?.includes('/meals');
    
    // Increase retry attempts for meals endpoint (common cold start issues)
    const maxRetries = isMealsEndpoint ? 3 : 2;
    const shouldRetry = (isTimeout || isServerError || isConnectionError) && !config._retry && config._retryCount < maxRetries;
    
    if (shouldRetry) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;
      
      console.log(`🔄 Retrying request (attempt ${config._retryCount}/${maxRetries}) for: ${config.url}`);
      
      // Wait before retrying with exponential backoff
      // First retry: 2s, Second retry: 4s, Third retry: 6s
      const delay = 2000 * config._retryCount;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        return await api.request(config);
      } catch (retryError) {
        // If retry also fails, continue with normal error handling
        error = retryError;
      }
    }
    
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
      // Network errors or timeouts - don't logout, just log
      if (isTimeout) {
        console.error('⏱️ Request timeout:', error.message);
      } else {
        console.error('🌐 Network error:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
