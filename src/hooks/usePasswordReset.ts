import { useState } from 'react';
import { authAPI } from '@/lib/api/api';

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authAPI.requestPasswordReset( email );
      setIsEmailSent(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isEmailSent,
    requestPasswordReset
  };
};