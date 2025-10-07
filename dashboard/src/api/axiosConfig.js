import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: __API_BASE_URL__,
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
