import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/Header/logo.png"
import banner from "../assets/Header/banner.png"
import { useTranslation } from '../locales';
import LanguageSwitcher from './LanguageSwitcher';

const HeaderHero = ({ backgroundImage = banner, showButtons = true, customTitle = null, customSubtitle = null, customButtons = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Background Image Container */}
      <div 
        className="w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/50"></div>
        {/* Header/Navigation - Positioned absolutely on top of the background */}
        <header className="absolute top-0 left-0 w-full z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="flex items-center">
                  <img src={logo} alt="Valley Rose" className="h-8 sm:h-10 lg:h-12 mr-2" />
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-6 xl:space-x-8">
                <Link to="/" className={`${currentPath === '/' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>{t('nav.home')}</Link>
                <Link to="/hotel" className={`${currentPath === '/hotel' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>{t('nav.hotel')}</Link>
                <Link to="/restaurant" className={`${currentPath === '/restaurant' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>{t('nav.restaurant')}</Link>
                <Link to="/contact" className={`${currentPath === '/contact' ? 'text-purple-300 font-bold border-b-2 border-purple-300' : 'text-white'} hover:text-purple-300 px-3 py-2 text-sm font-medium transition-all duration-200`}>{t('nav.contact')}</Link>
              </nav>

              {/* Language Selector */}
              <div className="hidden lg:flex items-center">
                <LanguageSwitcher />
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden flex items-center">
                <button 
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 focus:outline-none"
                >
                  <svg 
                    className={`${isMenuOpen ? 'hidden' : 'block'} h-5 w-5 sm:h-6 sm:w-6`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg 
                    className={`${isMenuOpen ? 'block' : 'hidden'} h-5 w-5 sm:h-6 sm:w-6`} 
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
          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white shadow-xl rounded-lg mx-4 mt-2 overflow-hidden`}>
            <div className="px-4 py-3 space-y-1">
              <Link 
                to="/" 
                className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  currentPath === '/' 
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('nav.home')}
              </Link>
              <Link 
                to="/hotel" 
                className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  currentPath === '/hotel' 
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t('nav.hotel')}
              </Link>
              <Link 
                to="/restaurant" 
                className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  currentPath === '/restaurant' 
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t('nav.restaurant')}
              </Link>
              <Link 
                to="/contact" 
                className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  currentPath === '/contact' 
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('nav.contact')}
              </Link>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Language:</span>
                <LanguageSwitcher className="w-32" />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        {(currentPath === '/booking' || currentPath === '/check') ? (
          /* Bottom positioned content for booking and check pages */
          <div className="absolute inset-0 flex flex-col justify-end items-start text-left z-10">
            <div className="max-w-4xl px-4 pb-8 sm:pb-12 lg:pb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl title-font mb-3 sm:mb-4">
                {customTitle || t('hero.bookYourStay')}
              </h1>
              <p className="text-white text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 title-font">{customSubtitle || t('hero.atValleyRose')}</p>
              {showButtons && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {customButtons || (
                    <>
                      <Link to="/booking" className="btn-primary font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md text-sm sm:text-base text-center">
                        {t('nav.bookRoom')}
                      </Link>
                      <Link to="/check" className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition duration-300 text-sm sm:text-base text-center">
                        {t('nav.checkReservation')}
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl title-font mb-3 sm:mb-4">
                <>
                  <span className="valley-rose-text">Valley Rose</span> <span className="text-white">Hotel - Restaurant</span>
                </>
              </h1>
              <p className="text-white text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 title-font">{t('hero.subtitle')}</p>
              {showButtons && (
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  {customButtons || (
                    <>
                      <Link to="/booking" className="btn-primary font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md text-sm sm:text-base text-center">
                        {t('nav.bookRoom')}
                      </Link>
                      <Link to="/check" className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition duration-300 text-sm sm:text-base text-center">
                        {t('nav.checkReservation')}
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