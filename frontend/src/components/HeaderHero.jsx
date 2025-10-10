import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/header/logo.png"
import banner from "../assets/header/banner.png"

const HeaderHero = ({ backgroundImage = banner, showButtons = true, customTitle = null, customSubtitle = null, customButtons = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Background Image Container */}
      <div 
        className="w-full min-h-[80vh] bg-cover bg relative" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/50"></div>
        {/* Header/Navigation - Positioned absolutely on top of the background */}
        <header className="absolute top-0 left-0 w-full z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="flex items-center">
                  <img src={logo} alt="Valley Rose" className="h-12 mr-2" />
                </a>
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
                <select className=" border border-white text-white rounded-md text-sm px-2 py-1">
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
        {(currentPath === '/booking' || currentPath === '/check') ? (
          /* Bottom positioned content for booking and check pages */
          <div className="absolute inset-0 flex flex-col justify-end items-start text-left z-10">
            <div className="max-w-4xl px-4 pb-16">
              <h1 className="text-4xl md:text-6xl title-font mb-4">
                {customTitle}
              </h1>
              <p className="text-white text-xl mb-8 title-font">{customSubtitle}</p>
              {showButtons && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {customButtons || (
                    <>
                      <Link to="/booking" className="btn-primary font-medium py-2 px-6 rounded-md">
                        Book a Room
                      </Link>
                      <Link to="/check" className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300">
                        Check Reservation
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Centered content for other pages */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl title-font mb-4">
                <>
                  <span className="valley-rose-text">Valley Rose</span> <span className="text-white">Hotel - Restaurant</span>
                </>
              </h1>
              <p className="text-white text-xl mb-8 title-font">Bei Toni</p>
              {showButtons && (
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {customButtons || (
                    <>
                      <Link to="/booking" className="btn-primary font-medium py-2 px-6 rounded-md">
                        Book a Room
                      </Link>
                      <Link to="/check" className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300">
                        Check Reservation
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderHero;