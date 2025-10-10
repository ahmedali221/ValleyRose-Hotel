import React, { useEffect, useState } from 'react';
import { mealService, restaurantService } from '../../../services/restaurantService';

const Recommendations = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Meal',
    thumbnail: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedThumbFile, setSelectedThumbFile] = useState(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState('');
  const [thumbNaturalW, setThumbNaturalW] = useState(0);
  const [thumbNaturalH, setThumbNaturalH] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const items = await mealService.listMeals({ recommended: true });
        setRecommendations(items);
      } catch (err) {
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (thumbPreviewUrl) URL.revokeObjectURL(thumbPreviewUrl);
    setSelectedThumbFile(file);
    setThumbPreviewUrl(URL.createObjectURL(file));
    // Defer actual upload until Add is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let thumbnailUrl = formData.thumbnail;
      if (selectedThumbFile) {
        const uploaded = await restaurantService.uploadGalleryImages([selectedThumbFile]);
        thumbnailUrl = uploaded?.[0]?.image || '';
      }
      const created = await mealService.createMeal({
        title: formData.title,
        description: formData.description,
        thumbnail: thumbnailUrl,
        type: formData.type,
        isRecommended: true,
      });
      setRecommendations(prev => [created, ...prev]);
      setFormData({ title: '', description: '', type: 'Meal', thumbnail: '' });
      if (thumbPreviewUrl) URL.revokeObjectURL(thumbPreviewUrl);
      setThumbPreviewUrl('');
      setSelectedThumbFile(null);
    } catch (err) {
      setError(err.message || 'Failed to add recommendation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({ title: '', description: '', type: 'Meal', thumbnail: '' });
    if (thumbPreviewUrl) URL.revokeObjectURL(thumbPreviewUrl);
    setThumbPreviewUrl('');
    setSelectedThumbFile(null);
    setThumbNaturalW(0);
    setThumbNaturalH(0);
  };

  const handleDelete = async (id) => {
    try {
      const updated = await mealService.toggleRecommended(id);
      if (updated && updated.isRecommended === false) {
        setRecommendations(prev => prev.filter(rec => rec._id !== id));
      }
    } catch (err) {
      setError(err.message || 'Failed to update recommendation');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Add New Recommendation Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 mr-3" style={{backgroundColor: 'var(--primary-color)'}}></div>
          <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
              placeholder="Meal Title"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
              placeholder="Meal Description"
              required
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{'--tw-ring-color': 'var(--primary-color)'}}
            >
              <option value="Meal">Meal</option>
              <option value="Soup">Soup</option>
            </select>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg text-center overflow-hidden relative w-40"
              style={{
                aspectRatio: '4 / 3',
                minHeight: '80px',
                maxHeight: '160px',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              {thumbPreviewUrl ? (
                <>
                  <img
                    src={thumbPreviewUrl}
                    alt="thumbnail preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setThumbNaturalW(img.naturalWidth || 0);
                      setThumbNaturalH(img.naturalHeight || 0);
                    }}
                  />
                  <label htmlFor="thumbnail-upload" className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded cursor-pointer shadow">Change</label>
                </>
              ) : (
                <label htmlFor="thumbnail-upload" className="cursor-pointer flex items-center justify-center w-full h-full">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl mb-1 leading-none" style={{color: 'var(--primary-color)'}}>+</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex  gap-4 w-full mt-2 px-4 py-4">
            <button
              type="button"
              onClick={handleClear}
              className="w-full px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-60"
              style={{backgroundColor: 'var(--primary-color)'}}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.backgroundColor = 'var(--primary-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.backgroundColor = 'var(--primary-color)';
                }
              }}
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Recommendations</h3>
        {loading && (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
        {recommendations.map((recommendation) => (
          <div key={recommendation._id} className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="flex items-start gap-6">
              {/* Thumbnail */}
              <div className="w-40 h-28 md:w-56 md:h-36 bg-gray-200  overflow-hidden flex-shrink-0">
                <img 
                  src={recommendation.thumbnail || '/api/placeholder/300/200'} 
                  alt={recommendation.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 py-2 pr-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-2xl font-semibold text-gray-900 truncate">
                      {recommendation.title}
                    </h4>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded text-sm" style={{backgroundColor: 'var(--primary-color)', color: 'white'}}>
                      {recommendation.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(recommendation._id)}
                    className="text-red-600 hover:text-red-800 text-base font-semibold"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-base text-gray-700 mt-3 leading-relaxed">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {recommendations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No recommendations yet. Add your first recommendation using the form on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;


