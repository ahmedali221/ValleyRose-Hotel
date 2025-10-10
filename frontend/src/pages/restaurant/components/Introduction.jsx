import React from 'react';
import { motion } from 'framer-motion';

const Introduction = () => {
  return (
    <section className="py-12 px-4 sm:px-6">
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
              className="text-3xl sm:text-4xl font-bold mb-2 title-font"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="valley-rose-text">Valley Rose</span>{' '}
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

        </div>
      </div>
    </section>
  );
};

export default Introduction;

