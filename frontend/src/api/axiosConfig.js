import axios from 'axios';

/**
 * Axios instance configured for the ValleyRose API
 * 
 * Configuration:
 * - Base URL: Uses VITE_API_BASE_URL from .env file, defaults to http://localhost:4000/api
 * - To configure: Create a .env file in the frontend root with:
 *   VITE_API_BASE_URL=http://localhost:4000/api
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

