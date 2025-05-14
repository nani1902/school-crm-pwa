// src/services/TokenService.js
import apiService from '../api/apiService';

// Define API_URL directly to avoid the undefined error
const API_URL = 'https://mahesh1902.pythonanywhere.com/crm/api/';

const TokenService = {
  // Check if cookies are supported and secure
  canUseCookies: () => {
    return navigator.cookieEnabled && window.location.protocol === 'https:';
  },
  
  // Save token (prefer cookies, fallback to localStorage)
  saveToken: (token) => {
    if (TokenService.canUseCookies()) {
      // Set a cookie with HttpOnly and Secure flags (these are set on server)
      // Here we just simulate it with a regular cookie for development
      document.cookie = `authToken=${token}; path=/; max-age=86400; samesite=strict`;
      localStorage.removeItem('authToken'); // Clean localStorage if exists
      return true;
    } else {
      // Fallback to localStorage with warning
      console.warn('Using less secure localStorage for token storage');
      localStorage.setItem('authToken', token);
      return false;
    }
  },
  
  // Get token from storage
  getToken: () => {
    if (TokenService.canUseCookies()) {
      // Try to get from cookie
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authToken') return value;
      }
      // If not found in cookies, token may have been revoked or expired
      return null;
    } else {
      // Get from localStorage
      return localStorage.getItem('authToken');
    }
  },
  
  // Remove token on logout
  removeToken: () => {
    if (TokenService.canUseCookies()) {
      // Clear the cookie
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
    }
    // Also clear localStorage in any case
    localStorage.removeItem('authToken');
  },
  
  // Save user role and data
  saveUserData: (role, userData) => {
    localStorage.setItem('userRole', role || '');
    localStorage.setItem('userData', JSON.stringify(userData || {}));
  },
  
  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole') || '';
  },
  
  // Get user data
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data', e);
        return null;
      }
    }
    return null;
  },
  
  // Clear all auth data
  clearAuthData: () => {
    TokenService.removeToken();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  },
  
  // Check if token is expired
  isTokenExpired: () => {
    const token = TokenService.getToken();
    if (!token) return true;
    
    // If your token is JWT, you can decode and check expiration
    // For demo purposes, we'll just assume tokens last 24 hours
    // In a real app, you'd decode the JWT and check the exp claim
    
    // For now we'll return false - indicating need to implement proper check
    return false;
  },
  
  // Refresh token
  refreshToken: async () => {
    try {
      // Get the current token
      const currentToken = TokenService.getToken();
      if (!currentToken) return false;
      
      // Use apiService instead of direct fetch to avoid API_URL reference issues
      try {
        const response = await apiService.post('auth/refresh-token/');
        
        if (response.data && response.data.token) {
          TokenService.saveToken(response.data.token);
          return true;
        }
        return false;
      } catch (apiError) {
        console.error('Token refresh API call failed:', apiError);
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }
};

export default TokenService;