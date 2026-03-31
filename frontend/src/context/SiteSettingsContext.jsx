import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Using the same base URL pattern as other frontend services
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        const response = await axios.get(`${apiUrl}/site-settings`);
        if (response.data.success) {
          setSettings(response.data.map || {});
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
