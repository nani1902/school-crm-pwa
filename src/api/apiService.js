import axios from 'axios';
import TokenService from '../services/TokenService';
import CSRFService from '../services/CSRFService';

// Backend API URL - set to your PythonAnywhere domain
const API_URL = 'https://mahesh1902.pythonanywhere.com/crm/api/';

// For local development testing, comment out the line above and uncomment this:
// const API_URL = 'http://localhost:8000/crm/api/';

console.log('API service initialized with URL:', API_URL);

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});

// Add a request interceptor to include authentication token and CSRF token
apiService.interceptors.request.use(
  async (config) => {
    // Get token using TokenService
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Add CSRF token for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = CSRFService.getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    console.log(`Making ${config.method?.toUpperCase()} request to: ${API_URL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle session expiry and token refresh
apiService.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url} with status: ${response.status}`);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    
    // Get the original request that caused the error
    const originalRequest = error.config;
    
    if (error.response) {
      console.log(`Error response status: ${error.response.status}`);
      console.log('Error response data:', error.response.data);
      
      // Handle 401 (Unauthorized) errors by refreshing the token
      if (error.response.status === 401 && !originalRequest._retry) {
        console.log('Unauthorized error - attempting token refresh');
        
        // Mark this request as already retried to prevent infinite loops
        originalRequest._retry = true;
        
        try {
          // Attempt to refresh the token
          const refreshSuccess = await TokenService.refreshToken();
          
          if (refreshSuccess) {
            console.log('Token refresh successful, retrying original request');
            
            // Update the token in the original request
            originalRequest.headers.Authorization = `Token ${TokenService.getToken()}`;
            
            // Retry the original request
            return apiService(originalRequest);
          } else {
            console.log('Token refresh failed, logging out user');
            // If refresh fails, log out the user
            TokenService.clearAuthData();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error('Error during token refresh:', refreshError);
          TokenService.clearAuthData();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Simple function to test API connectivity
export const testApiConnection = async () => {
  try {
    // Try to access the API docs endpoint which should be accessible without auth
    const response = await apiService.get('docs/');
    console.log('API connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error.message);
    return false;
  }
};

// API methods
export const authAPI = {
  testConnection: async () => {
    return await testApiConnection();
  },
  
  login: async (username, password) => {
    try {
      console.log(`Attempting login for user: ${username}`);
      
      const response = await apiService.post('auth/login/', { username, password });
      console.log('Login response received:', response.status);
      
      if (response.data && response.data.token) {
        console.log('Login successful, saving token and user data');
        TokenService.saveToken(response.data.token);
        TokenService.saveUserData(response.data.staff_role || '', response.data.user);
        return {
          success: true,
          data: response.data
        };
      } else {
        console.error('Login response missing token:', response.data);
        return {
          success: false,
          message: 'Invalid server response - missing authentication token'
        };
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      // Try to extract a meaningful error message
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data?.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection or the API server may be down.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Server is taking too long to respond. Please try again later.';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  },
  
  logout: async () => {
    console.log('Logging out - clearing auth data');
    TokenService.clearAuthData();
    return { success: true };
  },
  
  isAuthenticated: () => {
    const hasToken = !!TokenService.getToken();
    console.log(`Authentication check: ${hasToken ? 'Authenticated' : 'Not authenticated'}`);
    return hasToken;
  },
  
  getUserRole: () => {
    return TokenService.getUserRole();
  },
  
  getCurrentUser: () => {
    return TokenService.getUserData();
  }
};

export const leadsAPI = {
  getLeads: async (filters = {}) => {
    try {
      console.log('Fetching leads with filters:', filters);
      const response = await apiService.get('leads/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },
  
  getLead: async (leadId) => {
    try {
      console.log(`Fetching lead with ID: ${leadId}`);
      const response = await apiService.get(`leads/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${leadId}:`, error);
      throw error;
    }
  },
  
  createLead: async (leadData) => {
    try {
      console.log('Creating new lead with data:', leadData);
      const response = await apiService.post('leads/', leadData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },
  
  updateLead: async (leadId, leadData) => {
    try {
      console.log(`Updating lead ${leadId} with data:`, leadData);
      const response = await apiService.put(`leads/${leadId}/`, leadData);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead ${leadId}:`, error);
      throw error;
    }
  },
  
  updateLeadStatus: async (leadId, status) => {
    try {
      console.log(`Updating lead ${leadId} status to: ${status}`);
      const response = await apiService.post(`leads/${leadId}/update_status/`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating lead status ${leadId}:`, error);
      throw error;
    }
  },
  
  logInteraction: async (leadId, interactionData) => {
    try {
      console.log(`Logging interaction for lead ${leadId}:`, interactionData);
      const response = await apiService.post(`interactions/`, {
        ...interactionData,
        content_type: 'leads',
        object_id: leadId
      });
      return response.data;
    } catch (error) {
      console.error(`Error logging interaction for lead ${leadId}:`, error);
      throw error;
    }
  }
};

export const dashboardAPI = {
  getDashboardData: async () => {
    try {
      console.log('Fetching dashboard data');
      const response = await apiService.get('dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

export const studentsAPI = {
  getStudents: async (filters = {}) => {
    try {
      console.log('Fetching students with filters:', filters);
      const response = await apiService.get('students/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  getStudent: async (studentId) => {
    try {
      console.log(`Fetching student with ID: ${studentId}`);
      const response = await apiService.get(`students/${studentId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      throw error;
    }
  }
};

// Create a named variable for the export to fix the ESLint warning
const apiServiceExports = {
  auth: authAPI,
  leads: leadsAPI,
  dashboard: dashboardAPI,
  students: studentsAPI,
  testApiConnection
};

export default apiServiceExports;