import { Mail, Phone, MessageCircle, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "../assets/Header/logo.png";
import { useTranslation } from '../locales';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Logo */}
          <div className="flex-shrink-0 order-1 lg:order-1">
            <img src={logo} alt="Valley Rose" className="h-12 sm:h-16 lg:h-20" />
          </div>
          
          {/* Description */}
          <div className="flex-1 text-gray-300 text-center lg:text-left order-3 lg:order-2 px-4 lg:px-0">
            <p className="text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links and Social */}
          <div className="flex flex-col items-center lg:items-start flex-1 order-2 lg:order-3">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{t('footer.quickLinks')}</h4>
            <ul className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-gray-300 mb-4 sm:mb-6">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-purple-400 transition-colors text-sm sm:text-base hover:underline"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/hotel" 
                  className="hover:text-purple-400 transition-colors text-sm sm:text-base hover:underline"
                >
                  {t('nav.hotel')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/restaurant" 
                  className="hover:text-purple-400 transition-colors text-sm sm:text-base hover:underline"
                >
                  {t('nav.restaurant')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="hover:text-purple-400 transition-colors text-sm sm:text-base hover:underline"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>

            <div className="flex gap-3 sm:gap-4">
              <a 
                href="mailto:valleyrose@speed.at" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
                title="Send Email"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="tel:+436509106601" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/25"
                title="Call Us"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
          
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}