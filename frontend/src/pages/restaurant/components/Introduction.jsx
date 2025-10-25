import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../locales';

const Introduction = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
          {/* Left side - Text content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 title-font"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="valley-rose-text">Valley Rose</span>{' '}
              <span className="text-gray-800">Restaurant</span>
            </motion.h2>
            <motion.p 
              className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('restaurant.subtitle')}
            </motion.p>
            <motion.p 
              className="text-gray-700 leading-relaxed text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('restaurant.description')}
            </motion.p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Introduction;

