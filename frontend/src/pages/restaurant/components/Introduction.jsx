import React from 'react';
import { motion } from 'framer-motion';

const Introduction = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left side - Text content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-purple-600">Valley Rose</span>{' '}
              <span className="text-gray-800">Restaurant</span>
            </motion.h2>
            <motion.p 
              className="text-gray-500 text-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Authentic Austrian flavors, fresh every week
            </motion.p>
            <motion.p 
              className="text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              At Valley Rose Hotel, dining is more than just a service; it&apos;s a highlight of your stay. 
              Our in-house restaurant offers a warm, relaxed atmosphere where guests and visitors alike can 
              enjoy fresh, homemade Austrian cuisine, prepared with love by our chef, Toni. Every dish is 
              made using fresh, local ingredients, with a menu that changes weekly to bring new flavors to 
              the table.
            </motion.p>
          </motion.div>

          {/* Right side - Download Menu Section */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center">
              <motion.button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Download Menu
              </motion.button>
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h3 className="text-2xl font-bold text-purple-600 mb-2">
                  Valley Rose <span className="text-gray-800">Restaurant</span>
                </h3>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;

