import food from "../../../assets/food/food.png";
import food1 from "../../../assets/food/food1.png";
import { motion } from 'framer-motion';

const RestaurantSection = () => {
  return (
    <section className="bg-gray-50 text-white py-12 px-8">
      <div className="max-w-8xl mx-auto px-8 flex flex-col gap-8">
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
              className="w-full h-95 object-cover  shadow-lg"
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
                className="text-3xl font-bold mb-4 text-black "
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Where Tradition Meets Taste
              </motion.h2>
              <motion.h3 
                className="text-2xl font-semibold mb-6 text-black"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Our Restaurant
              </motion.h3>
              <motion.p 
                className="text-black text-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Enjoy the warm, welcoming flavors of Austrian home cooking at our in-house restaurant. Led by our chef Toni, each dish is prepared with love and rooted in local tradition. From hearty classics to seasonal specialties, we serve meals that bring comfort and delight to every guest.
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
            className="md:w-1/2 bg-gray-900 p-12 h-92 justify-center mt-30 flex-3 relative -mr-25 "
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h3 
              className="text-3xl font-medium mb-4 text-purple-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              At Valley Rose
            </motion.h3>
            <motion.p 
              className="text-gray-300 mb-8 leading-relaxed text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Our menu changes weekly, featuring new seasonal meals and homemade specials that reflect the flavors of the region, every dish is made with care and served with heart.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.a 
                href="#" 
                className="text-purple-400 hover:text-purple-300 flex items-center text-xl "
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <span>You can view this week's menu</span>
                <span className="ml-2 text-2xl">→</span>
              </motion.a>
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
              className="w-full h-full object-cover"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantSection;