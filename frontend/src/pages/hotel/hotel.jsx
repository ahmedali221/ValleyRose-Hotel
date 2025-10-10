import React from 'react';
import { motion } from 'framer-motion';
import StaySection from './components/StaySection';
import EventsSection from './components/EventsSection';
import HeaderHero from '../../components/HeaderHero';
import hotelBanner from '../../assets/banners/hotel.jpg';

const Hotel = () => {
  return (
    <motion.div 
      className="hotel-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderHero 
        backgroundImage={hotelBanner} 
        showButtons={true}
        customTitle={
          <>
            <span className="valley-rose-text">Valley Rose</span> <span className="text-white">Hotel</span>
          </>
        }
    
      />
      <StaySection />
      <EventsSection />
    </motion.div>
  );
};

export default Hotel;