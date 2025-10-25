import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { restaurantGalleryService } from '../../../services';
import { useTranslation } from '../../../locales';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const images = await restaurantGalleryService.getGalleryImages();
        setGalleryImages(images);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Handle image click to open modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = galleryImages.findIndex(img => img._id === selectedImage._id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
        setSelectedImage(galleryImages[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = galleryImages.findIndex(img => img._id === selectedImage._id);
        const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
        setSelectedImage(galleryImages[nextIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage, galleryImages]);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gray-800">{t('restaurant.lookAtTable')}</span>
          </motion.h2>
          <motion.p 
            className="text-gray-500 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('restaurant.galleryDescription')}
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex justify-center items-center py-8 sm:py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600"></div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="border border-red-200 rounded-lg p-4 sm:p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 mb-2 text-sm sm:text-base">{t('restaurant.failedToLoadGallery')}</p>
            <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {galleryImages.length === 0 ? (
              <motion.div 
                className="col-span-full text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-sm sm:text-base">{t('restaurant.noGalleryImages')}</p>
              </motion.div>
            ) : (
              galleryImages.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-purple-400"
                  style={{ aspectRatio: '1 / 1' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.4), 0 0 0 3px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)",
                    rotateY: 2,
                    rotateX: 2
                  }}
                  onClick={() => handleImageClick(item)}
                >
                  {/* Image */}
                  <motion.img
                    src={item.image}
                    alt={item.caption || t('restaurant.restaurantDish')}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f3f4f6" width="300" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EGallery Image%3C/text%3E%3C/svg%3E`;
                    }}
                  />

                  {/* Overlay on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-purple-800/30 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Bright color accent overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 via-transparent to-pink-500/40 opacity-0 group-hover:opacity-100 transition-all duration-400"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  ></motion.div>

                  {/* Enhanced shimmer effect with color */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-out"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 1,
                      x: "100%"
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>

                  {/* Corner accent */}
                  <motion.div 
                    className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"
                    initial={{ opacity: 0, x: 8, y: -8 }}
                    whileHover={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Caption overlay if available */}
                  {item.caption && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <p className="text-xs sm:text-sm text-center font-medium">{item.caption}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200"
              onClick={handleCloseModal}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <motion.button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = galleryImages.findIndex(img => img._id === selectedImage._id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
                    setSelectedImage(galleryImages[prevIndex]);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = galleryImages.findIndex(img => img._id === selectedImage._id);
                    const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
                    setSelectedImage(galleryImages[nextIndex]);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Main Image */}
            <motion.img
              src={selectedImage.image}
              alt={selectedImage.caption || t('restaurant.restaurantDish')}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23f3f4f6" width="600" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EGallery Image%3C/text%3E%3C/svg%3E`;
              }}
            />

            {/* Image Caption */}
            {selectedImage.caption && (
              <motion.div
                className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p className="text-center text-sm sm:text-base">{selectedImage.caption}</p>
              </motion.div>
            )}

            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <motion.div
                className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {galleryImages.findIndex(img => img._id === selectedImage._id) + 1} / {galleryImages.length}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;

