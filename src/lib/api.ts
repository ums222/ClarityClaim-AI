import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { supabase } from './supabase';

// Get API URL from environment variable or use default
// For Vercel: use relative path (serverless functions are at /api/*)
// For local dev: use the Express server URL
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor (for adding auth tokens)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();

    // If we have a session, add the access token to the request
    if (session?.access_token && config.headers) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

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
  async (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error('API Error:', { status, data });

      // Handle authentication errors
      if (status === 401) {
        // Token expired or invalid - sign out the user
        await supabase.auth.signOut();
        // Redirect to login page
        window.location.href = '/login';
      } else if (status === 403) {
        // User doesn't have permission
        console.error('Access forbidden');
      } else if (status >= 500) {
        // Handle server errors
        console.error('Server error');
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

export interface ContactData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    submittedAt: string;
  };
}

export interface NewsletterSubscribeData {
  email: string;
  name?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    email: string;
    subscribedAt: string;
  };
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  database?: string;
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

  // Submit contact form
  async submitContact(data: ContactData): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>('/contact', data);
    return response.data;
  },

  // Subscribe to newsletter
  async subscribeNewsletter(data: NewsletterSubscribeData): Promise<NewsletterResponse> {
    const response = await apiClient.post<NewsletterResponse>('/newsletter/subscribe', data);
    return response.data;
  },

  // Unsubscribe from newsletter
  async unsubscribeNewsletter(email: string): Promise<NewsletterResponse> {
    const response = await apiClient.post<NewsletterResponse>('/newsletter/unsubscribe', { email });
    return response.data;
  },
};

export default api;
