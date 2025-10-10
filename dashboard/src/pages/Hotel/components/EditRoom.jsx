import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hotelService } from '../../../services/hotelService';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: { english: '', german: '' },
    description: { english: '', german: '' },
    pricePerNight: '',
    ratingSuggestion: '',
    type: 'Single Room',
    coverImage: null,
    thumbnailImage: null,
    serviceGallery: []
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreviews, setImagePreviews] = useState({
    coverImage: null,
    thumbnailImage: null,
    serviceGallery: []
  });

  useEffect(() => {
    const loadRoomData = async () => {
      try {
        setLoading(true);
        const [roomResponse, roomTypesResponse] = await Promise.all([
          hotelService.getRoom(id),
          hotelService.getRoomTypes()
        ]);
        
        const room = roomResponse.data;
        setRoomTypes(roomTypesResponse.data);
        
        // Pre-fill form with existing room data
        const initialFormData = {
          title: room.title || { english: '', german: '' },
          description: room.description || { english: '', german: '' },
          pricePerNight: room.pricePerNight || '',
          ratingSuggestion: room.ratingSuggestion || '',
          type: room.type || 'Single Room',
          coverImage: null, // Will be handled separately for updates
          thumbnailImage: null, // Will be handled separately for updates
          serviceGallery: [] // Will be handled separately for updates
        };
        
        console.log('Loading room data:', room);
        console.log('Setting initial form data:', initialFormData);
        setFormData(initialFormData);

        // Set existing image previews
        setImagePreviews({
          coverImage: room.coverImage?.url || null,
          thumbnailImage: room.thumbnailImage?.url || null,
          serviceGallery: room.serviceGallery?.map(img => img.url) || []
        });

      } catch (error) {
        console.error('Failed to load room data:', error);
        setError('Failed to load room data');
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [id]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up all preview URLs when component unmounts
      if (imagePreviews.coverImage && imagePreviews.coverImage.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews.coverImage);
      }
      if (imagePreviews.thumbnailImage && imagePreviews.thumbnailImage.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews.thumbnailImage);
      }
      imagePreviews.serviceGallery.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileChange = (field, files) => {
    if (field === 'serviceGallery') {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: fileArray
      }));
      
      // Create previews for gallery images
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => ({
        ...prev,
        serviceGallery: [...prev.serviceGallery, ...previews]
      }));
    } else {
      const file = files[0] || null;
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      
      // Create preview for single image
      if (file) {
        const preview = URL.createObjectURL(file);
        setImagePreviews(prev => ({
          ...prev,
          [field]: preview
        }));
      } else {
        setImagePreviews(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!formData.title.english.trim() || !formData.title.german.trim()) {
      setError('Both English and German titles are required');
      setLoading(false);
      return;
    }

    if (!formData.pricePerNight || parseFloat(formData.pricePerNight) <= 0) {
      setError('Price per night must be a positive number');
      setLoading(false);
      return;
    }

    if (formData.ratingSuggestion && (parseFloat(formData.ratingSuggestion) < 1 || parseFloat(formData.ratingSuggestion) > 5)) {
      setError('Rating suggestion must be between 1 and 5');
      setLoading(false);
      return;
    }

    try {
      console.log('Updating room with data:', formData);
      await hotelService.updateRoom(id, formData);
      setSuccess('Room updated successfully!');
      
      // Navigate back to room preview after successful update
      setTimeout(() => {
        navigate(`/hotel/preview/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Room update error:', error);
      setError(error.message || 'Failed to update room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    // Clean up existing preview URLs to prevent memory leaks
    if (imagePreviews.coverImage && imagePreviews.coverImage.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews.coverImage);
    }
    if (imagePreviews.thumbnailImage && imagePreviews.thumbnailImage.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews.thumbnailImage);
    }
    imagePreviews.serviceGallery.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    
    // Reset to original room data
    navigate(`/hotel/preview/${id}`);
  };

  if (loading && !formData.title.english) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Edit Room Title Section */}
      <div className="flex items-center mb-6">
        <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
        <h2 className="text-lg font-semibold text-gray-900">Edit Room</h2>
        <button 
          onClick={() => navigate(`/hotel/preview/${id}`)}
          className="ml-4 px-4 py-2 text-white rounded-lg text-sm font-medium flex items-center" 
          style={{backgroundColor: 'var(--primary-color)'}}
        >
          <span className="mr-2">👁</span>
          Preview
        </button>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">
          Update the room details below. Ensure all information is accurate and reflects the quality our <span className="valley-rose-text">Valley Rose</span> guests expect.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Room/Apartment Title (English) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Title (English)
            </label>
            <input
              type="text"
              value={formData.title.english}
              onChange={(e) => handleInputChange('title.english', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
              placeholder="Give the room a clear, simple name (e.g., Double Room, Family Apartment)"
              required
            />
          </div>

          {/* Room/Apartment Title (German) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Title (German)
            </label>
            <input
              type="text"
              value={formData.title.german}
              onChange={(e) => handleInputChange('title.german', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
              placeholder="Enter room title in German"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Full Description (English) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description (English)
            </label>
            <textarea
              rows={4}
              value={formData.description.english}
              onChange={(e) => handleInputChange('description.english', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
              placeholder="Enter detailed description in English"
            />
          </div>

          {/* Full Description (German) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description (German)
            </label>
            <textarea
              rows={4}
              value={formData.description.german}
              onChange={(e) => handleInputChange('description.german', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
              placeholder="Enter detailed description in German"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide detailed room info, including amenities, layout, and unique features - in both languages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mr-24">
           {/* Cost Per Night */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Per Night
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': 'var(--primary-color)'}}
                placeholder="0.00"
                required
              />
              <span className="absolute right-3 top-2 valley-rose-text font-bold">€</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter amount in EUR. Use a 1-5 star scale based on quality.</p>
          </div>

          {/* Rating Suggestion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating Suggestion
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.ratingSuggestion}
                onChange={(e) => handleInputChange('ratingSuggestion', e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': 'var(--primary-color)'}}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-2 text-yellow-500">★</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Use a 1-5 star scale based on quality.</p>
          </div>
       </div>
          <div className="mb-6">
          {/* Room/Apartment Type */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room/Apartment Type
          </label>
          <select 
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 text-white rounded-lg focus:outline-none focus:ring-2 appearance-none"
            style={{
              '--tw-ring-color': 'var(--primary-color)',
              backgroundColor: 'var(--primary-color)'
            }}
          >
            {roomTypes.map((type) => (
              <option 
                key={type} 
                value={type}
                className="bg-white text-black"
              >
                {type}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Make sure to choose the right type</p>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cover */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('coverImage', e.target.files)}
                className="hidden"
                id="coverImage"
              />
              <label htmlFor="coverImage" className="cursor-pointer block h-full">
                {imagePreviews.coverImage ? (
                  <img 
                    src={imagePreviews.coverImage} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-4xl text-gray-400 mb-2">+</div>
                    <p className="text-gray-500">Upload Photo</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('thumbnailImage', e.target.files)}
                className="hidden"
                id="thumbnailImage"
              />
              <label htmlFor="thumbnailImage" className="cursor-pointer block h-full">
                {imagePreviews.thumbnailImage ? (
                  <img 
                    src={imagePreviews.thumbnailImage} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-4xl text-gray-400 mb-2">+</div>
                    <p className="text-gray-500">Upload Photo</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Service Gallery */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Gallery (Required)
          </label>
          <div className="flex flex-wrap gap-4">
            {/* Show uploaded images with previews */}
            {imagePreviews.serviceGallery.map((preview, index) => (
              <div key={index} className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={preview} 
                  alt={`Gallery preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    // Remove image from both formData and previews
                    const newFiles = formData.serviceGallery.filter((_, i) => i !== index);
                    const newPreviews = imagePreviews.serviceGallery.filter((_, i) => i !== index);
                    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
                    setFormData(prev => ({ ...prev, serviceGallery: newFiles }));
                    setImagePreviews(prev => ({ ...prev, serviceGallery: newPreviews }));
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            
            {/* Show placeholders for remaining slots */}
            {Array.from({ length: Math.max(0, 5 - imagePreviews.serviceGallery.length) }).map((_, index) => (
              <div key={`placeholder-${index}`} className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">📷</span>
              </div>
            ))}
            
            {/* Upload button */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange('serviceGallery', e.target.files)}
              className="hidden"
              id="serviceGallery"
            />
            <label htmlFor="serviceGallery" className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer" style={{'--tw-border-color': 'var(--primary-color)'}} onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary-color)'} onMouseLeave={(e) => e.target.style.borderColor = '#d1d5db'}>
              <span className="text-2xl text-gray-400">+</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload multiple images to showcase the room. Click × to remove images.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button 
            type="button"
            onClick={handleClear}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: 'var(--primary-color)'}}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'var(--primary-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = 'var(--primary-color)';
              }
            }}
          >
            {loading ? 'Updating...' : 'Update Room'}
          </button>
        </div>
        </form>
      </div>
      <p className="text-xs text-gray-500 mt-4">&copy; 2022-2025 by ValleyRose.com, Inc.</p>
    </div>
  );
};

export default EditRoom;
