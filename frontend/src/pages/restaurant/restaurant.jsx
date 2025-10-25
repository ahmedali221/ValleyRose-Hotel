import React from 'react';
import { motion } from 'framer-motion';
import Introduction from './components/Introduction';
import MenuDisplay from './components/MenuDisplay';
import RecommendedMeals from './components/RecommendedMeals';
import WeeklyMenu from './components/WeeklyMenu';
import Gallery from './components/Gallery';
import EventsSection from './components/EventsSection';
import HeaderHero from '../../components/HeaderHero';
import restaurantBanner from '../../assets/banners/restaurant.jpg';

const Restaurant = () => {
  return (
    <motion.div 
      className="min-h-screen content-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderHero 
        backgroundImage={restaurantBanner} 
        showButtons={false}
        customTitle={
          <>
            <span className="valley-rose-text">Valley Rose</span> <span className="text-white">Restaurant</span>
          </>
        }
      />
      <div className="space-y-0">
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

        {/* Events Section */}
        <EventsSection />
      </div>
    </motion.div>
  );
};

export default Restaurant;

