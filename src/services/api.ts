// services/api.ts
import qs from 'qs'; 

import axios from 'axios';

const API_BASE_URL = 'https://algecom.studxptm.com/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}
export interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
  role: string;
}

// Add an error interface
interface ApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          return Promise.reject(error);
        }

        // Implement refresh token endpoint when available
        // For now we'll just logout the user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/login/', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Store tokens and user data in localStorage
      if (response.data.access && response.data.refresh && response.data.user) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set the default Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiError;
        throw new Error(data.message || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Optional: Call logout endpoint if your API has one
      // await api.post('/logout/');
    } finally {
      // Clear all auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  signup: async (credentials: SignupData): Promise<AuthResponse> => {
    try {
      // Log the request data for debugging
      console.log('Sending signup request:', {
        ...credentials,
        password: '[REDACTED]',
        password_confirm: '[REDACTED]'
      });

      const response = await api.post<AuthResponse>('/register/', credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiError;
        const errorMessage = data.detail || data.message || 
          Object.values(data.errors || {}).flat().join(', ') ||
          'Registration failed';
        
        console.error('Signup error details:', {
          status: error.response.status,
          data: error.response.data
        });
        
        throw new Error(errorMessage);
      }
      throw new Error('Network error during signup');
    }
  },

  validateToken: async (token: string) => {
    try {
      const response = await api.post('/validate-token/', { token });
      return response.data;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/refresh-token/', {
        refresh: refreshToken
      });

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }

      return response.data;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw new Error('Could not refresh token');
    }
  },

  validateSession: async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user');

    if (!accessToken || !refreshToken || !user) {
      return false;
    }

    try {
      // Try to validate the current token
      await api.post('/validate-token/', { token: accessToken });
      return true;
    } catch (error) {
      // If token validation fails, try to refresh
      try {
        await authAPI.refreshToken(refreshToken);
        return true;
      } catch (refreshError) {
        // If refresh fails, clear storage and return false
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return false;
      }
    }
  },

  // إضافة interceptor للتعامل مع تجديد التوكن تلقائياً
  setupInterceptors: (navigate: any) => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await authAPI.refreshToken(refreshToken!);
            
            localStorage.setItem('access_token', response.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
            
            return api(originalRequest);
          } catch (error) {
            // إذا فشل تجديد التوكن، قم بتسجيل الخروج
            localStorage.clear();
            navigate('/login');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }
};

export default api;