"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI } from '@/lib/api/api';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const publicPages = ['/login', '/register', '/forgot-password', '/'];
        const isPublicPage = publicPages.includes(pathname);

        if (isPublicPage) {
          setIsChecking(false);
          return;
        }

        // Check auth status
        const isAuth = await authAPI.validateSession();
        
        if (!isAuth && !isPublicPage && mounted) {
          router.push('/login');
        }
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}