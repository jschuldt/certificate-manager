import { api } from './config';
import { ApiResponse } from '../../types';
import axios, { AxiosError } from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

interface CertificateResponse {
  message: string;
  queryUrl: string;
  timestamp: string;
}

export const checkCertificate = async (url: string): Promise<ApiResponse<CertificateResponse>> => {
  try {
    const response = await api.get('/api/check-certificate', {
      params: { url }
    });
    isDevelopment && console.log('API Response:', response);
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.error('API Error Details:', {
        error: error,
        isAxiosError: axios.isAxiosError(error),
        status: (error as AxiosError)?.response?.status,
        responseData: (error as AxiosError)?.response?.data,
        config: (error as AxiosError)?.config
      });
    }

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
