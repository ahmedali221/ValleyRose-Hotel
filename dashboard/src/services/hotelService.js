import api from '../api/axiosConfig';

// Hotel service for hotel management
export const hotelService = {
  // Get all rooms with pagination and filtering
  getRooms: async (params = {}) => {
    try {
      const response = await api.get('/rooms', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },
  
  // Get room types
  getRoomTypes: async () => {
    try {
      const response = await api.get('/rooms/types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room types');
    }
  },

  // Get single room by ID
  getRoom: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room');
    }
  },

  // Create new room
  createRoom: async (roomData) => {
    try {
      console.log('Creating room with data:', roomData);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('User not authenticated. Please login first.');
      }
      
      const formData = new FormData();
      
      // Add text fields - backend expects nested structure
      formData.append('title', JSON.stringify({
        english: roomData.title.english,
        german: roomData.title.german
      }));
      formData.append('description', JSON.stringify({
        english: roomData.description.english || '',
        german: roomData.description.german || ''
      }));
      formData.append('pricePerNight', roomData.pricePerNight);
      formData.append('ratingSuggestion', roomData.ratingSuggestion || '');
      formData.append('type', roomData.type);

      // Add images
      if (roomData.coverImage) {
        formData.append('coverImage', roomData.coverImage);
      }
      if (roomData.thumbnailImage) {
        formData.append('thumbnailImage', roomData.thumbnailImage);
      }
      if (roomData.serviceGallery && roomData.serviceGallery.length > 0) {
        roomData.serviceGallery.forEach((file, index) => {
          formData.append('serviceGallery', file);
        });
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post('/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Room creation error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        fullError: error
      });
      
      // Extract meaningful error message
      let errorMessage = 'Failed to create room';
      
      if (error.response?.status === 400) {
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = 'Invalid form data. Please check your inputs.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create rooms.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again or contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Update room
  updateRoom: async (id, roomData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (roomData.title) {
        formData.append('title[english]', roomData.title.english);
        formData.append('title[german]', roomData.title.german);
      }
      if (roomData.description) {
        formData.append('description[english]', roomData.description.english || '');
        formData.append('description[german]', roomData.description.german || '');
      }
      if (roomData.pricePerNight) formData.append('pricePerNight', roomData.pricePerNight);
      if (roomData.ratingSuggestion) formData.append('ratingSuggestion', roomData.ratingSuggestion);
      if (roomData.type) formData.append('type', roomData.type);

      // Add images
      if (roomData.coverImage) {
        formData.append('coverImage', roomData.coverImage);
      }
      if (roomData.thumbnailImage) {
        formData.append('thumbnailImage', roomData.thumbnailImage);
      }
      if (roomData.serviceGallery && roomData.serviceGallery.length > 0) {
        roomData.serviceGallery.forEach((file, index) => {
          formData.append('serviceGallery', file);
        });
      }

      const response = await api.put(`/rooms/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  },

  // Delete room
  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete room');
    }
  }
};
