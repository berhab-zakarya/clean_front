"use client"

import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI, User, LoginCredentials, SignupData } from '@/lib/api/api';
import { useStore } from '@/hooks/useStore';
import { useRouter } from 'next/navigation';

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_RESET_ERROR' };

interface AuthContextType {
  state: AuthState;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

export const isLoggedIn = () => {
  return Boolean(localStorage.getItem('access_token'));
};

// Constants
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Context Creation
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'AUTH_RESET_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { checkStoreExistence } = useStore();
  const router = useRouter();

  // Helper Functions
  const saveAuthData = useCallback((response: any) => {
    if (response?.access) localStorage.setItem('access_token', response.access);
    if (response?.refresh) localStorage.setItem('refresh_token', response.refresh);
    if (response?.user) localStorage.setItem('user', JSON.stringify(response.user));
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }, []);

  const validateToken = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!accessToken || !refreshToken) return null;

    try {
      // Ideally you should validate the access token with your API
      // If this is empty in your code, consider implementing a lightweight check
      return { accessToken, refreshToken };
    } catch (error) {
      try {
        // Only refresh if validation fails
        const newTokens = await authAPI.refreshToken(refreshToken);
        saveAuthData(newTokens);
        return newTokens;
      } catch (refreshError) {
        clearAuthData();
        return null;
      }
    }
  }, [saveAuthData, clearAuthData]);

  // Redirect handler - extracted to avoid redundancy
  const handleAuthRedirect = useCallback(async () => {
    try {
      const hasStore = await checkStoreExistence();
      
      // Using Next.js router for smoother transitions
      if (hasStore) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard/StoreSetupGuide');
      }
    } catch (error) {
      console.error('Redirect error:', error);
      // Default fallback
      router.push('/dashboard');
    }
  }, [checkStoreExistence, router]);

  // Auth Initialization - Optimized
  useEffect(() => {
    const initializeAuth = async () => {
      // Don't show loading if we already have user data
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          dispatch({ type: 'AUTH_SUCCESS', payload: userData });
        } catch (e) {
          // Invalid user data in localStorage
          localStorage.removeItem('user');
        }
      }
      
      // Still validate tokens in background
      dispatch({ type: 'AUTH_START' });
      
      try {
        const tokens = await validateToken();
        if (!tokens) {
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        // Only fetch user data if we don't have it already
        if (!cachedUser) {
          try {
            const userResponse = await authAPI.getUserProfile();
            saveAuthData({ user: userResponse });
            dispatch({ type: 'AUTH_SUCCESS', payload: userResponse });
          } catch (userError) {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, [validateToken, saveAuthData, clearAuthData]);

  // Auth Actions
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authAPI.login(credentials);
      saveAuthData(response);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      // Handle redirect after successful auth
      await handleAuthRedirect();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const signup = async (credentials: SignupData) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.signup(credentials);
      saveAuthData(response);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      // New users typically need store setup
      router.push('/dashboard/StoreSetupGuide');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Try to call logout API but don't wait for it
      authAPI.logout().catch(err => console.warn('Logout API error:', err));
      
      // Important: Clear data and update state immediately
      clearAuthData();
      dispatch({ type: 'AUTH_LOGOUT' });
      
      // Redirect to login/home
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even on error, we should clear local data
      clearAuthData();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const resetError = () => dispatch({ type: 'AUTH_RESET_ERROR' });

  // Provide more context values for convenience
  return (
    <AuthContext.Provider value={{ 
      state, 
      isAuthenticated: state.isAuthenticated, 
      user: state.user,
      loading: state.loading,
      error: state.error,
      login, 
      signup, 
      logout, 
      resetError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};