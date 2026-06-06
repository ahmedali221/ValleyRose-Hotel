import React from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../context/SiteSettingsContext';

const DynamicImage = ({ 
  settingsKey, 
  defaultImage, 
  alt, 
  className, 
  motionProps = {},
  style = {}
}) => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ ...style, minHeight: '100px' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const src = (settingsKey && settings[settingsKey]) ? settings[settingsKey] : defaultImage;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...motionProps}
    />
  );
};

export default DynamicImage;
