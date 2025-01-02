import { api } from './config.services';
import {
  ApiResponse,
  Certificate,
  CertificateResponse,
  CertificateSearchParams,
  SearchResponse,
  CertManager,
  CertificateUpdateParams,
  CreateCertificateData
} from '../../types/index.types';
import axios, { AxiosError } from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

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

export const searchCertificates = async (params: CertificateSearchParams): Promise<SearchResponse> => {
  try {
    console.log('Attempting to search certificates with params:', params);
    // Update the endpoint to match the swagger docs
    const response = await api.get('/api/certificates/search', {
      params,
      // Add timeout and better error handling
      timeout: 5000,
    });
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Certificate search error:', {
      error,
      status: axios.isAxiosError(error) ? error.response?.status : 'unknown',
      message: axios.isAxiosError(error) ? error.message : 'Unknown error',
      url: '/api/certificates/search',
      params
    });

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Certificate search endpoint not found. Please check API configuration.');
      }
      throw new Error(error.response?.data?.message || 'Failed to search certificates');
    }
    throw error;
  }
};

export const deleteCertificate = async (id: string): Promise<void> => {
  if (!id) {
    console.error('Delete called with invalid ID:', id);
    throw new Error('Invalid certificate ID');
  }

  if (isDevelopment) {
    console.log('🔍 Delete request initiated for certificate:', {
      id,
      requestUrl: `/api/certificates/${id}`
    });
  }

  try {
    const response = await api.delete(`/api/certificates/${id}`, {
      timeout: 5000, // Add timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (isDevelopment) {
      console.log('🔍 Delete response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        id
      });
    }

    if (response.status !== 204 && response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (isDevelopment) {
      console.error('🔍 Delete error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? error.response : null
      });
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error: Unable to reach the server');
      }
      if (error.response.status === 404) {
        throw new Error('Certificate not found');
      }
      throw new Error(
        error.response.data?.message ||
        `Server error (${error.response.status}): ${error.message}`
      );
    }
    throw new Error('Failed to delete certificate');
  }
};

export const updateCertificate = async (id: string, data: CertificateUpdateParams): Promise<void> => {
  if (!id) {
    throw new Error('Invalid certificate ID');
  }

  try {
    const response = await api.put(`/api/certificates/${id}`, {
      certManager: {
        ...data
      }
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error: Unable to reach the server');
      }
      throw new Error(
        error.response.data?.message ||
        `Server error (${error.response.status}): ${error.message}`
      );
    }
    throw error;
  }
};

export const createCertificate = async (data: CreateCertificateData) => {
  try {
    const response = await api.post('/api/certificates', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create certificate');
    }
    throw error;
  }
};

export const refreshCertificate = async (id: string, website: string): Promise<Certificate> => {
  const response = await api.post(`/api/certificates/${id}/refresh`, null, {
    params: { website: website }
  });
  return response.data;
};
