import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ className = '' }) => {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className={`relative w-full max-w-[140px] sm:max-w-[180px] ${className}`}>
      <select
        value={language}
        onChange={handleLanguageChange}
        className={`
          w-full
          border
          border-purple-300
          text-gray-800
          rounded-lg
          text-xs sm:text-sm
          px-2 sm:px-3
          py-1 sm:py-2
          bg-white
          appearance-none
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500
          focus:border-purple-500
          transition-all
          duration-200
          pr-6 sm:pr-8
          cursor-pointer
          hover:border-purple-400
          shadow-sm
        `}
      >
        <option value="en" className="bg-white text-gray-800">English</option>
        <option value="de" className="bg-white text-gray-800">Deutsch</option>
      </select>
      {/* Custom chevron for better mobile UX */}
      <span className="pointer-events-none absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-purple-500 text-xs">
        ▼
      </span>
    </div>
  );
  
};

export default LanguageSwitcher;
