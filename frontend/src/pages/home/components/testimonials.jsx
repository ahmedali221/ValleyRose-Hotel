import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../locales';

// Using SVG placeholder for profile image
import profileImg from '../../../assets/profile/profile-placeholder.svg';

const Testimonials = () => {
  const { t } = useTranslation();
  
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Seif Eli-islam',
      rating: 4.8,
      text: 'A warm and welcoming stay. The staff were incredibly kind, and the rooms spotless.'
    },
    {
      id: 2,
      name: 'Seif Eli-islam',
      rating: 4.8,
      text: 'A warm and welcoming stay. The staff were incredibly kind, and the rooms spotless.'
    },
    {
      id: 3,
      name: 'Seif Eli-islam',
      rating: 4.8,
      text: 'A warm and welcoming stay. The staff were incredibly kind, and the rooms spotless.'
    }
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <motion.span 
          key={i} 
          className="text-yellow-400 text-xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          ★
        </motion.span>
      );
    }
    return stars;
  };

  return (
    <section className="content-section py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-medium mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="valley-rose-text">{t('home.clientsRateUs')}</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('home.testimonialsSubtitle')}
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              {/* Profile Image */}
              <motion.div 
                className="w-20 h-20 rounded-full overflow-hidden mb-4"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
              >
                <img 
                  src={profileImg} 
                  alt={testimonial.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Name */}
              <motion.h3 
                className="text-lg font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
              >
                {testimonial.name}
              </motion.h3>
              
              {/* Rating */}
              <motion.div 
                className="flex items-center my-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
              >
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-gray-600">{testimonial.rating}</span>
              </motion.div>
              
              {/* Testimonial Text */}
              <motion.p 
                className="text-gray-600 text-center mt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
              >
                {testimonial.text}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;