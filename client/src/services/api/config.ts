import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3443';

export const api = axios.create({
  baseURL,
  timeout: 5000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log('🔍 API Request:', {
        baseURL,
        url: config.url,
        method: config.method,
        params: config.params
      });
    }
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('🔍 Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log('✅ Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ Response Error:', {
        config: error.config,
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);
