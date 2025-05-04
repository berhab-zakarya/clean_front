"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { login, logout, refreshToken } from '../api/auth';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const router = useRouter();

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      setUser(response.user);
      setAccessToken(response.access);
      setRefreshTokenValue(response.refresh);
      localStorage.setItem('refreshToken', response.refresh);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setRefreshTokenValue(null);
      localStorage.removeItem('refreshToken');
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const refreshAuth = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      setUser(null);
      setAccessToken(null);
      router.push('/login');
      return;
    }

    try {
      const response = await refreshToken({ refresh: storedRefreshToken });
      setAccessToken(response.access);
      setRefreshTokenValue(response.refresh);
      localStorage.setItem('refreshToken', response.refresh);
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('refreshToken');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken && !accessToken) {
      refreshAuth();
    }
  }, [accessToken, refreshAuth]);

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    loginUser,
    logoutUser,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
