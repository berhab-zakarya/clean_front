"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, refreshAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const tryRefresh = async () => {
        try {
          await refreshAuth();
        } catch {
          router.push('/login');
        }
      };
      tryRefresh();
    }
  }, [isAuthenticated, refreshAuth, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
