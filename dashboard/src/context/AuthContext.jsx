import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app startup
    console.log('🔍 AuthContext: Checking existing authentication...');
    
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          console.log('✅ AuthContext: Found existing authenticated user:', currentUser.email);
          setUser(currentUser);
        } else {
          console.log('⚠️ AuthContext: Authentication check failed, clearing data silently');
          // Clear data without redirecting
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } else {
        console.log('ℹ️ AuthContext: No existing authentication found');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error checking authentication:', error);
      // Clear data without redirecting on startup errors
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Login attempt initiated');
      setLoading(true);
      
      const result = await authService.login(credentials);
      
      if (result.success) {
        console.log('✅ AuthContext: Login successful, updating user state');
        setUser(result.user);
      } else {
        console.error('❌ AuthContext: Login failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('💥 AuthContext: Unexpected login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logout initiated');
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
