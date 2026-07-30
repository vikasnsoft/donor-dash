import axios from 'axios';

/**
 * Create a configured axios instance for API requests
 * Configured with:
 * - Base URL from env variable
 * - Default headers
 * - Credentials inclusion for cookies
 * - Request/response interceptors
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS - sends cookies with requests
});

// Request interceptor - adds auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookie storage
    const token = typeof window !== 'undefined' 
      ? document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1") 
      : '';
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle specific error codes
    if (response?.status === 401) {
      // Handle unauthorized access - could redirect to login
      console.error('Unauthorized access');
      // Optional: redirect to login
      // window.location.href = '/login';
    }
    
    if (response?.status === 403) {
      console.error('Forbidden access');
    }
    
    // Return a standardized error format
    return Promise.reject({
      message: response?.data?.message || 'An error occurred',
      status: response?.status,
      data: response?.data,
    });
  }
);

export default apiClient;
