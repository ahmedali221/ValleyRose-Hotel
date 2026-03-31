import React, { useState, useEffect } from 'react';
import { siteSettingsService } from '../../services/siteSettingsService';

const WebsiteImagesPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const result = await siteSettingsService.getSettings();
    if (result.success) {
      setSettings(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleImageChange = async (key, file) => {
    if (!file) return;

    setUpdatingKey(key);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('image', file);

    const result = await siteSettingsService.updateSetting(key, formData);
    
    if (result.success) {
      setSuccess(`Image for ${key} updated successfully!`);
      // Update local state
      setSettings(prev => prev.map(s => s.key === key ? result.data : s));
    } else {
      setError(result.error);
    }
    setUpdatingKey(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <div className="w-1 h-8 bg-purple-600 mr-4"></div>
        <h1 className="text-3xl font-bold text-gray-900 title-font">Website Images</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {settings.map((setting) => (
          <div key={setting.key} className="content-section-heavy p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Info section */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{setting.label}</h3>
                <p className="text-gray-600 mb-4">{setting.description || 'Manage this image section'}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-purple-600">{setting.key}</code>
              </div>

              {/* Preview & Action section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                    <img 
                      src={setting.imageUrl} 
                      alt={setting.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                  {updatingKey === setting.key && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                      <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`
                    cursor-pointer px-6 py-2 rounded-lg font-medium transition-all duration-200 text-center
                    ${updatingKey === setting.key ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'}
                  `}>
                    {updatingKey === setting.key ? 'Uploading...' : 'Change Image'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(setting.key, e.target.files[0])}
                      disabled={updatingKey === setting.key}
                    />
                  </label>
                  <span className="text-xs text-center text-gray-400">JPG, PNG or WEBP</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {settings.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No image settings found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteImagesPage;
