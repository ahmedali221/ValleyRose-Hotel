import React from 'react';
import { motion } from 'framer-motion';
import StaySection from './components/StaySection';
import HeaderHero from '../../components/HeaderHero';
import hotelBanner from '../../assets/banners/hotel.jpg';

const Hotel = () => {
  return (
    <motion.div 
      className="hotel-page min-h-screen"
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
      <div className="space-y-0">
        <StaySection />
      </div>
    </motion.div>
  );
};

export default Hotel;