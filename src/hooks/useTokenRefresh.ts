"use client"
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/api';
import { showErrorToast } from '@/utils/handle_errors';

export const useTokenRefresh = () => {
  const router = useRouter();

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await authAPI.refreshToken(refreshToken);
      
      // Update tokens in localStorage
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      return true;
    } catch (error) {
      // If refresh fails, clear auth data and redirect to login
      localStorage.clear();
      router.push('/login');
      showErrorToast('Session expired. Please login again.');
      return false;
    }
  }, [router]);

  // Set up automatic token refresh
  useEffect(() => {
    const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes
    
    const setupTokenRefresh = () => {
      // Initial token check
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      // Set up periodic token refresh
      const intervalId = setInterval(async () => {
        const success = await refreshAccessToken();
        if (!success) {
          clearInterval(intervalId);
        }
      }, REFRESH_INTERVAL);

      // Cleanup on unmount
      return () => clearInterval(intervalId);
    };

    return setupTokenRefresh();
  }, [refreshAccessToken]);

  return { refreshAccessToken };
};