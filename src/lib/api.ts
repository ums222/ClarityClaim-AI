import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor (for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error('API Error:', { status, data });
      
      // You can add custom error handling here
      if (status === 401) {
        // Handle unauthorized
      } else if (status === 403) {
        // Handle forbidden
      } else if (status >= 500) {
        // Handle server errors
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Types
export interface DemoRequestData {
  fullName: string;
  email: string;
  organizationName: string;
  organizationType?: string;
  monthlyClaimVolume?: string;
}

export interface DemoRequestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    organizationName: string;
    organizationType?: string;
    monthlyClaimVolume?: string;
    submittedAt: string;
  };
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
}

// API Functions
export const api = {
  // Health check
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await apiClient.get<HealthCheckResponse>('/health');
    return response.data;
  },

  // Submit demo request
  async submitDemoRequest(data: DemoRequestData): Promise<DemoRequestResponse> {
    const response = await apiClient.post<DemoRequestResponse>('/demo-request', data);
    return response.data;
  },
};

export default api;
