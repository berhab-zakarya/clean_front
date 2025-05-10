// services/api.ts
import axios from 'axios';

// Add this at the start of the file
const debug = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  }
};

// Change from https to http for local development
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface UserProfile {
  business_name: string;
  business_address: string | null;
  phone_number: string | null;
  tax_identification: string | null;
}

export interface User {
  id: number;
  email: string;
  role_name: string;
  email_verified: boolean;
  created_at: string;
  last_login_at: string;
  profile: UserProfile;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
  stores: any[]; // You can create a Store interface if needed
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
  role: string;
}

// Add these types to your existing types
export interface UserProfileResponse {
  user: User & {
    profile: {
      business_name: string;
      business_address: string | null;
      phone_number: string | null;
      tax_identification: string | null;
      is_verified: boolean;
      verification_document_url: string | null;
      bio: string | null;
      profile_image_url: string | null;
    };
  };
  stores: any[];
}

// Add to existing types
export interface UpdateProfileData {
  profile: {
    business_name?: string;
    business_address?: string | null;
    phone_number?: string | null;
    tax_identification?: string | null;
    is_verified?: boolean;
    verification_document_url?: string | null;
    bio?: string | null;
    profile_image_url?: string | null;
  };
}

// Add to existing interfaces
export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Add an error interface
interface ApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Add this type first, near your other interfaces
export interface RequestPasswordResetResponse {
  message: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  return !!(
    localStorage.getItem('access_token') && 
    localStorage.getItem('refresh_token') && 
    localStorage.getItem('user')
  );
};

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    debug.log('Request:', config.method?.toUpperCase(), config.url);
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    debug.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Update the response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt to refresh token if:
    // 1. Got a 401 error
    // 2. Request hasn't been retried yet
    // 3. User is logged in (has tokens and user data)
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      isUserLoggedIn() &&
      originalRequest.url !== '/login/' // Don't retry login requests
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        if (isRefreshing) {
          try {
            await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            return api(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        try {
          isRefreshing = true;
          const refreshResponse = await authAPI.refreshToken(refreshToken);
          isRefreshing = false;
          if (refreshResponse) {
            return api(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          isRefreshing = false;
          // If refresh fails, clear everything and redirect
          await authAPI.clearAuthData();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Log the request for debugging (redact sensitive data)
      debug.log('Sending login request:', {
        email: credentials.email,
        password: '[REDACTED]'
      });

      const response = await api.post<AuthResponse>('/login/', 
        // Make sure data is properly formatted
        {
          email: credentials.email,
          password: credentials.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Store tokens and user data in localStorage
      if (response.data.access && response.data.refresh && response.data.user) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log the error response for debugging
        debug.error('Login error:', error.response?.data);
        
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  },

  // Helper method to clear auth data
  clearAuthData: async (): Promise<void> => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Already logged out
        return;
      }

      // First try to notify the server
      try {
        await api.post('/logout/', null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (serverError) {
        // Continue with local logout even if server logout fails
        debug.error('Server logout failed, continuing with local logout:', serverError);
      }
      
      // Clear all auth data
      await authAPI.clearAuthData();
    } catch (error) {
      // Still clear auth data even if request fails
      await authAPI.clearAuthData();
      
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || 'Logout failed');
      }
      throw new Error('Network error during logout');
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        debug.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  },

  signup: async (credentials: SignupData): Promise<AuthResponse> => {
    try {
      debug.log('Sending signup request:', {
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
      // Check for network errors first
      if (!axios.isAxiosError(error)) {
        throw new Error('Network error during signup');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiError;
        const errorMessage = data.detail || data.message || 
          Object.values(data.errors || {}).flat().join(', ') ||
          'Registration failed';
        throw new Error(errorMessage);
      }
      
      throw new Error('An unexpected error occurred during signup');
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse | null> => {
    // Check if user is logged in before attempting refresh
    if (!isUserLoggedIn()) {
      debug.log('Not refreshing token: User is not logged in');
      return null;
    }

    try {
      const response = await api.post<AuthResponse>('/token/refresh/', 
        { refresh: refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '' // Clear auth header for this request
          }
        }
      );
      
      if (!response.data.access) {
        throw new Error('No access token in response');
      }

      // Update token in localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Update Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      processQueue();
      return response.data;

    } catch (error: any) {
      debug.error('Refresh error:', error.response?.data || error.message);
      processQueue(error);
      
      // Clean up and log out
      await authAPI.clearAuthData();
      
      throw new Error('Could not refresh token');
    }
  },

  validateSession: async (): Promise<boolean> => {
    // First check if auth data exists locally
    if (!isUserLoggedIn()) {
      return false;
    }

    try {
      // Try to use the access token
      await api.get('/profile/');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          // If access token fails, try to refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) return false;
          
          const response = await authAPI.refreshToken(refreshToken);
          return !!response?.access;
        } catch (refreshError) {
          await authAPI.clearAuthData();
          return false;
        }
      }
      return false;
    }
  },

  checkAuthStatus: async (): Promise<boolean> => {
    // Don't even try if we don't have the basics
    if (!isUserLoggedIn()) {
      return false;
    }

    // Try to validate the session
    try {
      return await authAPI.validateSession();
    } catch (error) {
      debug.error('Auth status check error:', error);
      return false;
    }
  },

  initializeAuth: async (router: any) => {
    try {
      const isAuthenticated = await authAPI.checkAuthStatus();
      if (isAuthenticated) {
        // If user is logged in, redirect to dashboard
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      debug.error('Auth initialization error:', error);
      return false;
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfileResponse> => {
    try {
      const response = await api.put<UserProfileResponse>('/profile/', data);
      
      // Update local storage with new user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || 'Failed to update profile');
      }
      throw new Error('Network error during profile update');
    }
  },

  changePassword: async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
    try {
      const response = await api.post<ChangePasswordResponse>('/change-password/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || 'Failed to change password');
      }
      throw new Error('Network error during password change');
    }
  },

  requestPasswordReset: async (email: string): Promise<RequestPasswordResetResponse> => {
    try {
      const response = await api.post<RequestPasswordResetResponse>('/password-reset/request/', {
        email: email
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || 'Failed to send reset email');
      }
      throw new Error('Network error during password reset request');
    }
  },
};

export default api;