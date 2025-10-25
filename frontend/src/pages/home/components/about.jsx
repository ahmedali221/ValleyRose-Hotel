import React from 'react';
import { motion } from 'framer-motion';
import right from "../../../assets/Header/right.png";
import { useTranslation } from '../../../locales';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="content-section p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 title-font text-center sm:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.welcome')}
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-sm sm:text-base md:text-lg text-center sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('home.subtitle')}
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column - Text Content */}
          <motion.div 
            className="space-y-4 sm:space-y-6 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.p 
              className="text-gray-700 leading-relaxed text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {t('home.description1')}
            </motion.p>

            <motion.p 
              className="text-gray-700 leading-relaxed text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {t('home.description2')}
            </motion.p>

            {/* Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button 
                className="btn-primary px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg font-semibold shadow-md text-sm sm:text-base w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('home.bookRoom')}
              </motion.button>
              <motion.button 
                className="bg-white hover:bg-gray-100 valley-rose-text px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors border-2 border-gray-200 text-sm sm:text-base w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('home.viewAllRooms')}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Room Image */}
          <motion.div 
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Placeholder for room image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="text-center p-4 sm:p-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    <img 
                      src={right} 
                      alt={t('home.roomImageAlt')} 
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                    <p className="text-gray-400 text-xs sm:text-sm">{t('home.roomImageAlt')}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative Element */}
            <motion.div 
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-purple-200 rounded-full opacity-50 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ 
                maxWidth: 'calc(100% + 1rem)',
                maxHeight: 'calc(100% + 1rem)'
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-20 h-20 sm:w-32 sm:h-32 bg-purple-300 rounded-full opacity-30 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{ 
                maxWidth: 'calc(100% + 1rem)',
                maxHeight: 'calc(100% + 1rem)'
              }}
            ></motion.div>
          </motion.div>
        </div>

       
      </div>
    </div>
  );
}