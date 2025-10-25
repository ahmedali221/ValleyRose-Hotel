import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mealService } from '../../../services';
import { useTranslation } from '../../../locales';

const RecommendedMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecommendedMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const recommendedMeals = await mealService.getRecommendedMeals();
        setMeals(recommendedMeals);
      } catch (err) {
        console.error('Error fetching recommended meals:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedMeals();
  }, []);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gray-800">{t('restaurant.recommendedMeals')}</span>
          </motion.h2>
          <motion.p 
            className="text-gray-500 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Authentic Austrian flavors, fresh every week
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex justify-center items-center py-8 sm:py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600"></div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="border border-red-200 rounded-lg p-4 sm:p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 mb-2 text-sm sm:text-base">{t('restaurant.failedToLoadMeals')}</p>
            <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          </motion.div>
        )}

        {/* Meals Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {meals.length === 0 ? (
              <motion.div 
                className="col-span-full text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-sm sm:text-base">{t('restaurant.noRecommendedMeals')}</p>
              </motion.div>
            ) : (
              meals.map((meal, index) => (
                <motion.div 
                  key={meal._id} 
                  className="flex flex-col sm:flex-row rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {/* Meal Image */}
                  <motion.div 
                    className="h-40 sm:h-48 overflow-hidden flex-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  >
                    <img 
                      src={meal.thumbnail || '/placeholder-meal.jpg'} 
                      alt={meal.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EMeal%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </motion.div>

                  {/* Meal Info */}
                  <motion.div 
                    className="p-4 sm:p-6 flex-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  >
                    <h3 className="text-lg sm:text-xl font-bold valley-rose-text mb-2 sm:mb-3">
                      {meal.title}
                    </h3>
                    {meal.description && (
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {meal.description}
                      </p>
                    )}
                    {meal.type && (
                      <span className="inline-block mt-2 sm:mt-3 px-2 sm:px-3 py-1 bg-purple-100 valley-rose-text text-xs font-semibold rounded-full">
                        {meal.type}
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedMeals;

