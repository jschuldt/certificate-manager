import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3443',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log('🚀 Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        headers: config.headers,
        params: config.params,
      });
    }
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ Request Error:', error);
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
