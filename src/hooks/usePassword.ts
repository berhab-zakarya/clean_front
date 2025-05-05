import { useState } from 'react';
import { authAPI, ChangePasswordData } from '@/lib/api/api';

export const usePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.changePassword(data);
      return { success: true, message: response.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    changePassword
  };
};