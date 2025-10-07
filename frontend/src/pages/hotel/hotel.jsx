import React from 'react';
import { motion } from 'framer-motion';
import StaySection from './components/StaySection';
import EventsSection from './components/EventsSection';

const Hotel = () => {
  return (
    <motion.div 
      className="hotel-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <StaySection />
      <EventsSection />
    </motion.div>
  );
};

export default Hotel;