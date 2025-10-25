import food from "../../../assets/food/food.png";
import food1 from "../../../assets/food/food1.png";
import { motion } from 'framer-motion';
import { useTranslation } from '../../../locales';
import { Link, useLocation } from 'react-router-dom';


const RestaurantSection = () => {
  const { t } = useTranslation();

  return (
    <section className="content-section text-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* First Row - Image Left, Text Right */}
        <motion.div 
          className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Column - Image */}
          <motion.div 
            className="lg:w-1/2 flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src={food1}
              alt="Delicious dishes at Valley Rose"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Right Column - Text */}
          <motion.div 
            className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex-1 flex items-center bg-gray-50 rounded-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <motion.h2 
                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-black title-font"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('home.restaurantTitle')}
              </motion.h2>
              <motion.h3 
                className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-black title-font"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {t('home.ourRestaurant')}
              </motion.h3>
              <motion.p 
                className="text-black text-sm sm:text-base lg:text-lg mb-4 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                {t('home.restaurantDescription')}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Second Row - Text Left, Image Right */}
        <motion.div 
          className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Left Column - Text with dark background */}
          <motion.div 
            className="lg:w-1/2 bg-gray-900 p-6 sm:p-8 lg:p-12 flex-1 flex items-center rounded-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <motion.h3 
                className="text-xl sm:text-2xl lg:text-3xl font-medium mb-3 sm:mb-4 valley-rose-text title-font"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('home.atValleyRose')}
              </motion.h3>
              <motion.p 
                className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {t('home.menuDescription')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <motion.div
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/restaurant"
                    className="valley-rose-text hover:text-purple-300 flex items-center text-base sm:text-lg lg:text-xl"
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <span>{t('home.viewMenu')}</span>
                    <span className="ml-2 text-lg sm:text-xl lg:text-2xl">→</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Column - Image */}
          <motion.div 
            className="lg:w-1/2 flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.img
              src={food}
              alt="Valley Rose food spread"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantSection;