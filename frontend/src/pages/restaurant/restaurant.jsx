import React from 'react';
import { motion } from 'framer-motion';
import Introduction from './components/Introduction';
import MenuDisplay from './components/MenuDisplay';
import RecommendedMeals from './components/RecommendedMeals';
import WeeklyMenu from './components/WeeklyMenu';
import Gallery from './components/Gallery';

const Restaurant = () => {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Introduction Section */}
      <Introduction />

      {/* Menu Display Section */}
      <MenuDisplay />

      {/* Weekly Menu Section */}
      <WeeklyMenu />

      {/* Recommended Meals Section */}
      <RecommendedMeals />

      {/* Gallery Section */}
      <Gallery />
    </motion.div>
  );
};

export default Restaurant;

