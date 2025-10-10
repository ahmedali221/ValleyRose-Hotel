import { en } from './en';
import { de } from './de';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en,
  de
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value for "${key}" is not a string`);
      return key;
    }
    
    // Simple parameter replacement
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] || match;
    });
  };
  
  return { t, language, isGerman: language === 'de', isEnglish: language === 'en' };
};

export default translations;
