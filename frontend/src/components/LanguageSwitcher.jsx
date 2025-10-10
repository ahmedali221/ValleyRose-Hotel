import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ className = '' }) => {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <select 
      value={language} 
      onChange={handleLanguageChange}
      className={`border border-white text-white rounded-md text-sm px-2 py-1 bg-transparent ${className}`}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LanguageSwitcher;
