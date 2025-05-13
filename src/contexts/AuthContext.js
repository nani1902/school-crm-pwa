// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../api/apiService';

// Create Authentication Context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount, check if user is authenticated
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing authentication context');
      if (apiService.auth.isAuthenticated()) {
        try {
          // Get user data from localStorage
          const userData = apiService.auth.getCurrentUser();
          const userRole = apiService.auth.getUserRole();
          
          console.log('Found authenticated user:', userData);
          console.log('User role:', userRole);
          
          setUser(userData);
          setRole(userRole);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Clear potentially corrupted data
          await apiService.auth.logout();
          setIsAuthenticated(false);
        }
      } else {
        console.log('No authenticated user found');
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    console.log(`AuthContext: login called for user ${username}`);
    setLoading(true);
    try {
      const result = await apiService.auth.login(username, password);
      console.log('AuthContext: login result:', result);
      
      if (result && result.success) {
        const userData = apiService.auth.getCurrentUser();
        const userRole = apiService.auth.getUserRole();
        
        setUser(userData);
        setRole(userRole);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        return { 
          success: false, 
          message: result?.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('AuthContext: login error:', error);
      setIsAuthenticated(false);
      setLoading(false);
      return { 
        success: false, 
        message: error.message || 'An unexpected error occurred during login.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    console.log('AuthContext: logout called');
    setLoading(true);
    await apiService.auth.logout();
    setUser(null);
    setRole('');
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Provide auth context value
  const value = {
    user,
    role,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;