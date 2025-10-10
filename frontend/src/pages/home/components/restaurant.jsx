import food from "../../../assets/food/food.png";
import food1 from "../../../assets/food/food1.png";
import { motion } from 'framer-motion';
import { useTranslation } from '../../../locales';
import { Link, useLocation } from 'react-router-dom';


const RestaurantSection = () => {
  const { t } = useTranslation();

  return (
    <section className="content-section text-white py-8 sm:py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col gap-6 lg:gap-8">
        {/* First Row - Image Left, Text Right with equal height */}
        <motion.div 
          className="flex flex-col md:flex-row items-stretch "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Column - Image */}
          <motion.div 
            className="md:w-1/2 flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src={food1}
              alt="Delicious dishes at Valley Rose"
              className="w-full h-95 object-cover  shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Right Column - Text */}
          <motion.div 
            className="md:w-1/2 p-6  flex-1 flex items-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold mb-4 text-black title-font"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {t('home.restaurantTitle')}
              </motion.h2>
              <motion.h3 
                className="text-xl sm:text-2xl font-semibold mb-6 text-black title-font"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {t('home.ourRestaurant')}
              </motion.h3>
              <motion.p 
                className="text-black text-lg mb-4"
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

        <motion.div 
          className="flex flex-col md:flex-row height-92 "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Right Column - Text with dark background */}
          <motion.div 
            className="md:w-1/2 bg-gray-900 p-12 h-92 justify-center mt-20 flex-3 relative -mr-25 "
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h3 
              className="text-3xl font-medium mb-4 valley-rose-text title-font"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('home.atValleyRose')}
            </motion.h3>
            <motion.p 
              className="text-gray-300 mb-8 leading-relaxed text-lg"
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
                  className="valley-rose-text hover:text-purple-300 flex items-center text-xl"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <span>{t('home.viewMenu')}</span>
                  <span className="ml-2 text-2xl">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Left Column - Image */}
          <motion.div 
            className="md:w-1/2 flex-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.img
              src={food}
              alt="Valley Rose food spread"
              className="w-full h-full object-cover rounded-lg"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantSection;