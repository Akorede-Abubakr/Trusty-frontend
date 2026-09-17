import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: Attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trusty_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract payload and format errors
api.interceptors.response.use(
  (response) => {
    // Return standard data payload if available
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected network error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
      raw: error,
    };

    // Auto logout if 401 Unauthorized (token expired / invalid)
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('trusty_auth_token');
      localStorage.removeItem('trusty_auth_user');
      // Redirect cleanly if on protected path
      if (!window.location.pathname.includes('/register') && !window.location.pathname.includes('/forgot-password')) {
        window.dispatchEvent(new CustomEvent('trusty:auth:expired'));
      }
    }

    return Promise.reject(customError);
  }
);

export default api;
