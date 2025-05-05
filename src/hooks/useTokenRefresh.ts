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
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      return true;
    } catch (error) {
      localStorage.clear();
      router.push('/login');
      showErrorToast('Session expired. Please login again.');
      return false;
    }
  }, [router]);

  useEffect(() => {
    const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes
    
    const setupTokenRefresh = () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      let intervalId: NodeJS.Timer;

      const refresh = async () => {
        const success = await refreshAccessToken();
        if (!success) {
          clearInterval(intervalId);
        }
      };

      // Initial refresh
      refresh();
      
      intervalId = setInterval(refresh, REFRESH_INTERVAL);
      return () => clearInterval(intervalId);
    };

    return setupTokenRefresh();
  }, [refreshAccessToken]);

  return { refreshAccessToken };
};