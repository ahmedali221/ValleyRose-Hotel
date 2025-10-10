import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { roomService } from '../../../services/roomService';

const StaySection = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  // Fetch rooms from backend
  const fetchRooms = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.getRooms({
        page,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setRooms(response.data);
        setTotalPages(response.pagination.total);
        setTotalItems(response.pagination.totalItems);
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <section className="py-12 px-4 sm:px-8 content-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-medium mb-2 title-font"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Stay at <span className="valley-rose-text">Valley Rose Hotel!</span>
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button 
              onClick={() => fetchRooms(currentPage)}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Room Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative hover:shadow-md transition-shadow cursor-pointer"
                style={{ minHeight: '250px' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onClick={() => handleRoomClick(room._id)}
              >
                {/* Purple Header - 85% width, above image, with rounded corner */}
                <motion.div
                  className="absolute top-0 left-0 z-10 flex justify-between items-center px-4 py-3"
                  style={{
                    width: '85%',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: '0.75rem',
                    backgroundColor: '#9962B9',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white">{room.title?.english || room.type}</h3>
                  <div className="flex items-center text-sm text-white">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>({room.ratingSuggestion || '4.8'})</span>
                  </div>
                </motion.div>
                
                {/* Room Image */}
                <motion.div 
                  className="w-full h-80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                >
                  <img 
                    src={room.thumbnailImage?.url || '/placeholder-room.jpg'} 
                    alt={room.title?.english || room.type || 'Room at Valley Rose Hotel'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-room.jpg';
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center mt-12 space-x-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-gray-500 text-sm">
                ({totalItems} rooms total)
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Booking CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/booking"
            className="inline-block btn-primary px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            Book Your Stay Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default StaySection;