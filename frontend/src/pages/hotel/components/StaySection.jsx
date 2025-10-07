import React from 'react';
import { motion } from 'framer-motion';
import singleRoom from '../../../assets/rooms/single.png';
import doubleRoom from '../../../assets/rooms/double.png';
import masterRoom from '../../../assets/rooms/master.png';

const StaySection = () => {
  // Room data
  const rooms = [
    {
      id: 1,
      type: 'Single Room',
      price: '€80',
      image: singleRoom,
      alt: 'Comfortable single room at Valley Rose Hotel'
    },
    {
      id: 2,
      type: 'Double Room',
      price: '€120',
      image: doubleRoom,
      alt: 'Spacious double room at Valley Rose Hotel'
    },
    {
      id: 3,
      type: 'Master Room',
      price: '€160',
      image: masterRoom,
      alt: 'Luxurious master room at Valley Rose Hotel'
    }
  ];

  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-8xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-medium mb-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Stay at <span className="text-purple-500">Valley Rose Hotel!</span>
          </motion.h2>
          <motion.p 
            className="text-gray-700 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At Valley Rose Hotel, we believe that comfortable living is at the heart of every great stay. 
            Our goal is to create a peaceful, homely atmosphere where you can relax, unwind, and feel truly cared for. 
            Whether you're here for a short break or an extended vacation, we aim to make your time with us a warm and unforgettable experience.
          </motion.p>
        </motion.div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative hover:shadow-md transition-shadow"
              style={{ minHeight: '250px' }} // Increased card height
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              {/* Purple Header - 85% width, above image, with rounded corner */}
              <motion.div
                className="absolute top-0 left-0 z-10 flex justify-between items-center px-4 py-3"
                style={{
                  width: '85%',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: '0.75rem',
                  backgroundColor: '#9333ea', // Tailwind purple-600
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white">{room.type}</h3>
                <div className="flex items-center text-sm text-white">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>(4.8)</span>
                </div>
              </motion.div>
              
              {/* Room Image */}
              <motion.div 
                className="w-full h-80" // Increased image height
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
              >
                <img 
                  src={room.image} 
                  alt={room.alt} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaySection;