import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/api';
import { showSuccessToast, showErrorToast } from '@/utils/handle_errors';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Get access token
      const token = localStorage.getItem('access_token');
      if (!token) {
        // If no token, just clear storage and redirect
        localStorage.clear();
        router.push('/login');
        return;
      }

      // Try to logout from server
      await authAPI.logout();
      
      // Clear all local storage
      localStorage.clear();
      
      // Show success message
      showSuccessToast('Logged out successfully');
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      // Even if server logout fails, clear local storage
      localStorage.clear();
      
      showErrorToast(error instanceof Error ? error.message : 'Failed to logout');
      console.error('Logout error:', error);
      
      // Still redirect to login
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut
  };
};