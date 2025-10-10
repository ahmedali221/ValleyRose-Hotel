import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import logo from "../../assets/header/logo.png";

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.getRoomById(id);
      
      if (response.success) {
        setRoom(response.data);
      } else {
        setError('Room not found');
      }
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError(err.message || 'Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Navigate to booking page with room type pre-selected
    navigate(`/booking?roomType=${encodeURIComponent(room.type)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/hotel"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Hotel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image Container */}
        <div 
          className="w-full min-h-[80vh] bg-cover bg-center relative" 
          style={{ backgroundImage: `url(${room?.coverImage?.url || room?.thumbnailImage?.url || '/placeholder-room.jpg'})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/50"></div>
          
          {/* Header/Navigation - Positioned absolutely on top of the background */}
          <header className="absolute top-0 left-0 w-full z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Link to="/" className="flex items-center">
                    <img src={logo} alt="Valley Rose" className="h-12 mr-2" />
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link to="/" className={`${currentPath === '/' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>Home</Link>
                  <Link to="/hotel" className={`${currentPath === '/hotel' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>Hotel</Link>
                  <Link to="/restaurant" className={`${currentPath === '/restaurant' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>Restaurant</Link>
                  <Link to="/contact" className={`${currentPath === '/contact' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>Contact us</Link>
                </nav>

                {/* Language Selector */}
                <div className="hidden md:flex items-center">
                  <select className="bg-transparent border border-white text-white rounded-md text-sm px-2 py-1">
                    <option>English</option>
                    <option>Deutsch</option>
                  </select>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                  <button 
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 focus:outline-none"
                  >
                    <svg 
                      className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg 
                      className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" className={`block px-3 py-2 text-base font-medium ${currentPath === '/' ? 'text-purple-600' : 'text-gray-800'} hover:text-purple-600`}>Home</Link>
                <Link to="/hotel" className={`block px-3 py-2 text-base font-medium ${currentPath === '/hotel' ? 'text-purple-600' : 'text-gray-800'} hover:text-purple-600`}>Hotel</Link>
                <Link to="/restaurant" className={`block px-3 py-2 text-base font-medium ${currentPath === '/restaurant' ? 'text-purple-600' : 'text-gray-800'} hover:text-purple-600`}>Restaurant</Link>
                <Link to="/contact" className={`block px-3 py-2 text-base font-medium ${currentPath === '/contact' ? 'text-purple-600' : 'text-gray-800'} hover:text-purple-600`}>Contact us</Link>
              </div>
              <div className="px-4 py-3 border-t border-gray-200">
                <select className="w-full bg-transparent border border-gray-300 rounded-md text-sm px-2 py-1">
                  <option>English</option>
                  <option>Deutsch</option>
                </select>
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center pt-25">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left Side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white"
                >
                  {/* Price and Rating */}
                  <div className="mb-6">
                      €{room.pricePerNight} / Night
                    
                      <span className="text-yellow-400 ml-3">★</span>
                      <span className="text-lg">({room.ratingSuggestion || '4.8'})</span>
                    
                  </div>

                  {/* Description */}
                  <div className="mb-8 space-y-4">
                    <p className="text-lg leading-relaxed">
                      {room.description?.english || `Spacious, bright, and perfect for families or small groups, our ${room.type.toLowerCase()} offers a comfortable stay with everything you need to feel at home. It includes cozy bedrooms, a welcoming living area, a private bathroom, and large windows with a beautiful view of the surrounding area.`}
                    </p>
                   
                  </div>

                  {/* Room Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold mb-8 title-font">
                    {room.title?.english || room.type}
                  </h1>

                  {/* Book Now Button */}
                  <motion.button
                    onClick={handleBookNow}
                    className="btn-primary px-4 py-2 rounded-lg text-l font-semibold shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book it Now
                  </motion.button>
                </motion.div>

                {/* Right Side - Room Image */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute top-30 -right-20 z-10   border-2 border-white rounded-lg shadow-2xl ">
                    <img
                      src={room.thumbnailImage?.url || room.coverImage?.url || '/placeholder-room.jpg'}
                      alt={room.title?.english || room.type}
                      className="w-55 h-75 object-cover rounded-lg shadow-2xl"
                      onError={(e) => {
                        e.target.src = '/placeholder-room.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 content-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-start mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 title-font">
            A Glimpse Into Your Stay
          </h2>
          <p className='text-l text-gray-400 '>
            Take a closer look at our rooms, restaurant, and the peaceful charm of Valley Rose.
          </p>
        </motion.div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main room images */}
          {room.serviceGallery && room.serviceGallery.length > 0 ? (
            room.serviceGallery.slice(0, 6).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={image.url}
                  alt={`${room.title?.english || room.type} - Image ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/placeholder-room.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))
          ) : (
            // Fallback placeholder images if no gallery
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src="/placeholder-room.jpg"
                  alt={`${room.title?.english || room.type} - Image ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))
          )}
        </div>

        {/* Back to Hotel Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            to="/hotel"
            className="inline-flex items-center valley-rose-text hover:text-purple-300 font-medium text-lg"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Hotel Rooms
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;