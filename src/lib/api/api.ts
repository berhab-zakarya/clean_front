// services/api.ts
import qs from 'qs'; 

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await authAPI.refreshToken(refreshToken);
        
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.access}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, clear auth and redirect to login
        localStorage.clear();
        window.location.href = '/login';
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
      console.log('Sending login request:', {
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
        console.error('Login error:', error.response?.data);
        
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await api.post('/logout/', null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Clear all auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      // Still clear auth data even if request fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      
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
      return JSON.parse(userStr);
    }
    return null;
  },

  signup: async (credentials: SignupData): Promise<AuthResponse> => {
    try {
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
      const response = await api.post<AuthResponse>('/token/refresh/', {
        refresh: refreshToken
      });

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        // Update user data if available in response
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      // Clear all auth data on failure
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
      // Instead of validating token, try to use it
      await api.get('/profile/'); // or any protected endpoint
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const response = await authAPI.refreshToken(refreshToken);
          if (response.access) {
            localStorage.setItem('access_token', response.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
            return true;
          }
        } catch (refreshError) {
          await authAPI.logout();
          return false;
        }
      }
      return false;
    }
  },

  // إضافة interceptor للتعامل مع تجديد التوكن تلقائياً
  setupInterceptors: (navigate: any) => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }
            
            const response = await api.post('/token/refresh/', {
              refresh: refreshToken
            });
            
            localStorage.setItem('access_token', response.data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            
            return api(originalRequest);
          } catch (error) {
            localStorage.clear();
            navigate('/login');
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  },

  // أولاً نضيف دالة جديدة للتحقق من حالة المصادقة
  checkAuthStatus: async (): Promise<boolean> => {
    try {
      const user = localStorage.getItem('user');
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      // التحقق من وجود البيانات الأساسية
      if (!user || !accessToken || !refreshToken) {
        return false;
      }

      // محاولة التحقق من صلاحية التوكن
      try {
        await api.post('/validate-token/', { token: accessToken });
        return true;
      } catch (error) {
        // إذا كان التوكن منتهي الصلاحية، نحاول تجديده
        try {
          const response = await authAPI.refreshToken(refreshToken);
          if (response.access) {
            localStorage.setItem('access_token', response.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
            return true;
          }
        } catch (refreshError) {
          // إذا فشل تجديد التوكن، نقوم بتسجيل الخروج
          await authAPI.logout();
          return false;
        }
      }
    } catch (error) {
      return false;
    }
    return false;
  },

  initializeAuth: async (router: any) => {
    try {
      const isAuthenticated = await authAPI.checkAuthStatus();
      if (isAuthenticated) {
        // إذا كان المستخدم مسجل الدخول، نقوم بتوجيهه إلى لوحة التحكم
        router.push('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth initialization error:', error);
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
};

export default api;