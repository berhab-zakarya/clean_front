"use client"

import React, { createContext, useReducer, useEffect } from 'react';
import { authAPI, User, LoginCredentials, SignupData } from '@/lib/api/api';
import { useStore } from '@/hooks/useStore';

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
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

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

  // Auth Initialization
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_START' });
      
      try {
        const tokens = await validateAndRefreshTokens();
        if (!tokens) {
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        const user = await loadUserData();
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // Auth Methods
  const validateAndRefreshTokens = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!accessToken || !refreshToken) return null;

    try {
    
      return { accessToken, refreshToken };
    } catch (error) {
      try {
        const newTokens = await authAPI.refreshToken(refreshToken);
        localStorage.setItem('access_token', newTokens.access);
        localStorage.setItem('refresh_token', newTokens.refresh);
        return newTokens;
      } catch {
        throw new Error('Session expired');
      }
    }
  };

  const loadUserData = async () => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  };

  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  // Auth Actions
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authAPI.login(credentials);
      saveAuthData(response);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      
      // تحقق من وجود متجر قبل التوجيه
      const hasStore = await checkStoreExistence();
      console.log('Login successful, has store:', hasStore);

      if (hasStore) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/dashboard/StoreSetupGuide';
      }
      
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await authAPI.logout();
      clearAuthData();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Logout failed' });
    }
  };

  const resetError = () => dispatch({ type: 'AUTH_RESET_ERROR' });

  const saveAuthData = (response: any) => {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  return (
    <AuthContext.Provider value={{ state, isAuthenticated: state.isAuthenticated, login, signup, logout, resetError }}>
      {children}
    </AuthContext.Provider>
  );
};