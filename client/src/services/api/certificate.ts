import { api } from './config';
import { ApiResponse } from '../../types';
import axios, { AxiosError } from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

interface CertificateResponse {
  message: string;
  queryUrl: string;
  timestamp: string;
}

const checkNetworkStatus = async () => {
  if (!navigator.onLine) {
    throw new Error('No internet connection available');
  }
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3443';
  
  if (isDevelopment) {
    console.log('🔍 Checking server availability at:', apiUrl);
    console.log('Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL
    });
  }

  try {
    const testResponse = await fetch(apiUrl, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    if (isDevelopment) {
      console.log('🔍 Server test response:', testResponse);
    }
  } catch (error) {
    if (isDevelopment) {
      console.error('🔍 Server test failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        apiUrl
      });
    }
    throw new Error(`Cannot reach the server at ${apiUrl}. Please check if the server is running.`);
  }
};

const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Remove trailing slashes and normalize protocol
    return urlObj.toString().replace(/\/$/, '');
  } catch (error) {
    throw new Error('Invalid URL format');
  }
};

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log('🔍 API Request:', {
        url: config.url,
        method: config.method,
        params: config.params,
        headers: config.headers
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

export const checkCertificate = async (url: string): Promise<ApiResponse<CertificateResponse>> => {
  try {
    await checkNetworkStatus();
    
    const normalizedUrl = normalizeUrl(url);
    if (isDevelopment) {
      console.log('Normalized URL:', normalizedUrl);
      console.log('Original URL:', url);
    }

    const response = await api.get('/api/check-certificate', {
      params: { url: normalizedUrl }
    });
    
    if (isDevelopment) {
      console.log('Full API Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
    }
    
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.error('Detailed Error Information:', {
        error: error,
        isAxiosError: axios.isAxiosError(error),
        response: {
          status: (error as AxiosError)?.response?.status,
          statusText: (error as AxiosError)?.response?.statusText,
          data: (error as AxiosError)?.response?.data,
          headers: (error as AxiosError)?.response?.headers
        },
        request: {
          url: (error as AxiosError)?.config?.url,
          params: (error as AxiosError)?.config?.params,
          method: (error as AxiosError)?.config?.method
        }
      });
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error(`Network error: Unable to reach the server. Details: ${error.message}`);
      }
      
      const errorMessage = error.response.data?.message || error.message;
      const errorDetails = error.response.data?.details || '';
      
      switch (error.response.status) {
        case 500:
          throw new Error(
            `Server error (500): ${errorMessage}\n` +
            `Details: ${errorDetails}\n` +
            `URL attempted: ${url}`
          );
        case 404:
          throw new Error('API endpoint not found. Please check the server configuration.');
        default:
          throw new Error(
            error.response.data?.message || 
            `Server error (${error.response.status}): ${error.message}`
          );
      }
    }
    throw error;
  }
};
