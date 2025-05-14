// src/services/CSRFService.js
const CSRFService = {
  // Get CSRF token from cookie
  getCSRFToken: () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') return value;
    }
    return null;
  },
  
  // Initialize CSRF protection by requesting a token
  initCSRF: async () => {
    try {
      // For Django backends, visiting any page sets the CSRF cookie
      const response = await fetch('/csrf/', {
        method: 'GET',
        credentials: 'include' // This is important for cookies
      });
      
      if (response.ok) {
        console.log('CSRF token initialized');
        return true;
      } else {
        console.warn('CSRF initialization failed');
        return false;
      }
    } catch (error) {
      console.error('CSRF initialization error:', error);
      return false;
    }
  }
};

export default CSRFService;