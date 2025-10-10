import React from 'react';
import { motion } from 'framer-motion';
import eventImage from '../../../assets/events/event-space.svg';
import hotel1 from "../../../assets/hotel/hotel1.png"
import hotel2 from "../../../assets/hotel/hotel2.png"
import { useTranslation } from '../../../locales';

const EventsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 px-4 sm:px-8 content-section-light">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-medium mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('hotel.hostYourEvent')}
          </motion.h2>
          <motion.p 
            className="text-gray-700 max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('hotel.eventDescription1')}
          </motion.p>
          <motion.p 
            className="text-gray-700 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t('hotel.eventDescription2')}
          </motion.p>
        </motion.div>

    {/* Event Space Showcase */}
        <motion.div 
          className="relative flex items-center justify-center mt-12 lg:mt-20 py-16 lg:py-30 px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {/* Container with relative positioning */}
          <div className="relative w-full max-w-7xl mx-auto">
            
            {/* Center Card - Background layer */}
            <motion.div 
              className="relative bg-gray-800 text-white px-10 py-12 lg:px-16 lg:py-14 rounded-2xl shadow-2xl z-0 max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative dots */}
              <motion.div 
                className="flex justify-center gap-2 mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="w-2 h-2 rounded-full bg-gray-600"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1.4 + i * 0.1 }}
                  ></motion.div>
                ))}
              </motion.div>
              
              <motion.h3 
                className="text-3xl md:text-4xl mb-4 font-light title-font"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                {t('hotel.atValleyRose')}
              </motion.h3>
              <motion.p 
                className="text-gray-200 mb-6 text-xl font-light"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                {t('hotel.allEventsMustBeArranged')}
              </motion.p>
              <motion.p 
                className="text-gray-300 leading-relaxed text-base max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                {t('hotel.eventPlanningDescription')}
              </motion.p>
              <motion.a
                href="#"
                className="inline-block mt-8 btn-primary py-3 px-10 rounded-full text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 2.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hotel.contactUs')}
              </motion.a>
            </motion.div>
            
            {/* Left Image - On top and to the left */}
            <motion.div 
              className="absolute start-0 bottom-15 left-2 "
              initial={{ opacity: 0, x: -100, rotate: -10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <img 
                src={hotel2} 
                alt={t('hotel.outdoorSeating')} 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>

            {/* Right Image - On top and to the right */}
            <motion.div 
              className="absolute top-20 right-2"
              initial={{ opacity: 0, x: 100, rotate: 10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.4 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <img 
                src={hotel1} 
                alt={t('hotel.indoorVenue')} 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;