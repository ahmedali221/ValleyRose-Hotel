import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { restaurantGalleryService } from '../../../services';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gray-800">A Look at What&apos;s on the</span>{' '}
            <span className="valley-rose-text">Table</span>
          </motion.h2>
          <motion.p 
            className="text-gray-500 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get a taste of our kitchen with real photos of our weekly dishes, always fresh, always homemade.
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="border border-red-200 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 mb-2">Failed to load gallery images</p>
            <p className="text-red-500 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.length === 0 ? (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500">No gallery images available at the moment.</p>
              </motion.div>
            ) : (
              galleryImages.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                  style={{ aspectRatio: '1 / 1' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {/* Image */}
                  <motion.img
                    src={item.image}
                    alt={item.caption || 'Restaurant dish'}
                    className="w-full h-full object-cover"
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
                    className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Caption overlay if available */}
                  {item.caption && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-center">{item.caption}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

