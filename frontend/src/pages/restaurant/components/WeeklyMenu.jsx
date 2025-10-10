import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weeklyMenuService } from '../../../services';
import restaurantImage from '../../../assets/restaurant/restaurant.png';
import { useTranslation } from '../../../locales';

const WeeklyMenu = () => {
  const [weeklyMenuItems, setWeeklyMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Calculate current week dates dynamically
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate the start of the week (Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay - 1); // Go back to Saturday

    const daysArray = [];
    const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const fullName = dayNames[i];
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      daysArray.push({
        fullName: fullName,
        date: dateStr
      });
    }

    return daysArray;
  };

  const currentWeekDates = getCurrentWeekDates();

  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const menuData = await weeklyMenuService.getWeeklyMenu();
        setWeeklyMenuItems(menuData);
      } catch (err) {
        console.error('Error fetching weekly menu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyMenu();
  }, []);

  // Format date if available, otherwise use empty string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section 
      className="relative py-12 px-4 sm:px-6 overflow-hidden"
     
    >
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
        <img src={restaurantImage} alt="restaurant" className="absolute bottom-20 left-40 object-cover" />
    </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full">
        <div className="relative min-h-[600px] lg:min-h-[700px]">
          {/* Left Side - New Taste Every Week - Positioned at Top Left */}
          <motion.div 
            className="absolute -top-15 -left-10 w-full lg:w-[45%] bg-gray-900 bg-opacity-90 p-8 lg:p-12 rounded-lg backdrop-blur-sm shadow-2xl"
            initial={{ opacity: 0, x: -100, y: -50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-6 title-font"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-white">{t('restaurant.newTasteEveryWeek')}</span>
            </motion.h2>
            <motion.p 
              className="text-gray-300 leading-relaxed text-sm lg:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('restaurant.weeklyMenuDescription')}
            </motion.p>
          </motion.div>

          {/* Right Side - Weekly Menu - Positioned at Bottom Right */}
          <motion.div 
            className="absolute -bottom-10 -right-15  w-full lg:w-[50%] bg-gray-800 bg-opacity-95 p-8 lg:p-10 rounded-lg backdrop-blur-sm shadow-2xl mt-64 lg:mt-0"
            initial={{ opacity: 0, x: 100, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 title-font"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="text-white">{t('restaurant.weeklyMenu')}</span>
            </motion.h2>

            {/* Loading State */}
            {loading && (
              <motion.div 
                className="flex justify-center items-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div 
                className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Menu Items */}
            {!loading && !error && (
              <motion.div 
                className="space-y-4 lg:space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {weeklyMenuItems.length === 0 ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-400">{t('restaurant.noWeeklyMenu')}</p>
                  </motion.div>
                ) : (
                  weeklyMenuItems.map((dayMenu, index) => (
                    <motion.div 
                      key={dayMenu._id || index} 
                      className="border-b border-gray-700 pb-4 lg:pb-6 last:border-b-0"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {/* Day and Date */}
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-purple-400 text-lg lg:text-xl font-semibold">
                          {dayMenu.day}
                        </h3>
                        <span className="text-gray-400 text-xs lg:text-sm">
                          {currentWeekDates.find(d => d.fullName === dayMenu.day)?.date || ''}
                        </span>
                      </div>

                      {/* Meals */}
                      {dayMenu.meals && dayMenu.meals.length > 0 && (
                        <div className="space-y-2 lg:space-y-3 mb-3">
                          <h5 className="text-purple-300 text-xs font-semibold uppercase tracking-wide">{t('restaurant.meals')}</h5>
                          {dayMenu.meals.map((meal, mealIndex) => (
                            <div key={meal._id || mealIndex}>
                              <h4 className="text-white font-semibold text-sm lg:text-base mb-1">
                                {meal.title}
                              </h4>
                              {meal.description && (
                                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                                  {meal.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Soups */}
                      {dayMenu.soups && dayMenu.soups.length > 0 && (
                        <div className="space-y-2 lg:space-y-3">
                          <h5 className="text-purple-300 text-xs font-semibold uppercase tracking-wide">{t('restaurant.soups')}</h5>
                          {dayMenu.soups.map((soup, soupIndex) => (
                            <div key={soup._id || soupIndex}>
                              <h4 className="text-white font-semibold text-sm lg:text-base mb-1">
                                {soup.title}
                              </h4>
                              {soup.description && (
                                <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                                  {soup.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Empty state for day */}
                      {(!dayMenu.meals || dayMenu.meals.length === 0) && 
                       (!dayMenu.soups || dayMenu.soups.length === 0) && (
                        <p className="text-gray-500 text-sm italic">{t('restaurant.noItemsForDay')}</p>
                      )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.7);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.9);
        }
      `}</style>
    </section>
  );
};

export default WeeklyMenu;

