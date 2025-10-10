import React from 'react';
import { motion } from 'framer-motion';
import right from "../../../assets/header/right.png";

export default function About() {
  return (
    <div className="content-section p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to <span className="valley-rose-text">Valley Rose Hotel!</span>
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Where Every Stay <span className="valley-rose-text font-semibold">Blooms</span> with Comfort
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Column - Text Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.p 
              className="text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Experience the taste of tradition with our home-style cuisine, 
              lovingly prepared under the direction of Toni. Each dish is 
              crafted with care and features a variety of regional Austrian 
              delicacies designed to delight your palate. Let us treat you 
              in the evening with our thoughtfully curated menu.
            </motion.p>

            <motion.p 
              className="text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Our cozy 3-star hotel in Vienna's 22nd district offers quick 
              access to the city center and top attractions. We look 
              forward to making your stay memorable.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button 
                className="btn-primary px-6 sm:px-8 py-3 rounded-lg font-semibold shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Room
              </motion.button>
              <motion.button 
                className="bg-white hover:bg-gray-100 valley-rose-text px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors border-2 border-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Rooms
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Room Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Placeholder for room image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="text-center p-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    <img 
                      src={right} 
                      alt="Cozy Room with Modern Amenities" 
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                    <p className="text-gray-400 text-sm">Cozy Room with Modern Amenities</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative Element */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-50 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-300 rounded-full opacity-30 blur-3xl"
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
            ></motion.div>
          </motion.div>
        </div>

       
      </div>
    </div>
  );
}