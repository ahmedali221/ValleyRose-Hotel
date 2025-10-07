import React, { useEffect, useState } from 'react';
import { restaurantService } from '../../../services/restaurantService';

const Main = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState('');

  const [menuDoc, setMenuDoc] = useState(null); // { _id, pdfFile }
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [isUploadingMenu, setIsUploadingMenu] = useState(false);
  const [menuError, setMenuError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingGallery(true);
      setIsLoadingMenu(true);
      setGalleryError('');
      setMenuError('');
      try {
        const [images, menu] = await Promise.all([
          restaurantService.getGalleryImages(),
          restaurantService.getMainMenu().catch(() => null)
        ]);
        setGalleryImages(images.map((it) => ({
          id: it._id,
          url: it.image,
          name: it.caption || 'Image'
        })));
        setMenuDoc(menu);
      } catch (err) {
        setGalleryError(err.message || 'Failed to load gallery');
      } finally {
        setIsLoadingGallery(false);
        setIsLoadingMenu(false);
      }
    };
    loadData();
  }, []);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setIsUploadingGallery(true);
    setGalleryError('');
    try {
      const uploaded = await restaurantService.uploadGalleryImages(files);
      const normalized = uploaded.map((it) => ({ id: it._id, url: it.image, name: it.caption || 'Image' }));
      setGalleryImages((prev) => [...normalized, ...prev]);
    } catch (err) {
      setGalleryError(err.message || 'Failed to upload images');
    } finally {
      setIsUploadingGallery(false);
      // reset input value so the same files can be chosen again if needed
      event.target.value = '';
    }
  };

  const handleImageDelete = async (id) => {
    try {
      await restaurantService.deleteGalleryImage(id);
      setGalleryImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      setGalleryError(err.message || 'Failed to delete image');
    }
  };

  const handleMenuUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingMenu(true);
    setMenuError('');
    try {
      const saved = await restaurantService.uploadMainMenu(file);
      setMenuDoc(saved);
    } catch (err) {
      setMenuError(err.message || 'Failed to upload menu');
    } finally {
      setIsUploadingMenu(false);
      event.target.value = '';
    }
  };

  const handleMenuDelete = async () => {
    try {
      await restaurantService.deleteMainMenu();
      setMenuDoc(null);
    } catch (err) {
      setMenuError(err.message || 'Failed to delete menu');
    }
  };

  return (
    <div className="space-y-8">
      {/* Restaurant Gallery Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-purple-600 mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">Restaurant Gallery</h2>
        </div>

        {galleryError && (
          <div className="mb-4 text-sm text-red-600">{galleryError}</div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {isLoadingGallery && (
            <div className="col-span-2 md:col-span-4 text-gray-500 text-sm">Loading gallery...</div>
          )}
          {galleryImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleImageDelete(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          
          {/* Add Photo Button */}
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload" className="cursor-pointer text-center">
              <div className="text-4xl text-purple-600 mb-2">+</div>
              <p className="text-sm text-gray-500">{isUploadingGallery ? 'Uploading...' : 'Add Photo'}</p>
            </label>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Please make sure all uploaded photos are of good quality, well-lit, and clearly show the dishes or restaurant space, this helps attract and impress our guests.
        </p>
      </div>

      {/* Restaurant Main Menu Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-purple-600 mr-3"></div>
          <h2 className="text-xl font-semibold text-gray-900">Restaurant Main Menu</h2>
        </div>

        <div className="max-w-md">
          {menuError && (
            <div className="mb-4 text-sm text-red-600">{menuError}</div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="menu-upload"
              onChange={handleMenuUpload}
            />
            <label 
              htmlFor="menu-upload"
              className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <span className="text-gray-500">{isUploadingMenu ? 'Uploading...' : 'Choose PDF file'}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </label>
          </div>

          <div className="mt-4">
            {isLoadingMenu && (
              <p className="text-sm text-gray-500">Loading current menu...</p>
            )}
            {menuDoc && !isLoadingMenu && (
              <div className="flex items-center space-x-3">
                <a href={menuDoc.pdfFile} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline text-sm">View current menu</a>
                <button onClick={handleMenuDelete} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            )}
            {!menuDoc && !isLoadingMenu && (
              <p className="text-sm text-gray-500">No menu uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;


