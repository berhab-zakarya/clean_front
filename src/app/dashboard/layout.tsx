'use client';

import { DashboardHeader } from '@/components/dashboard/layout/dashboard-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Sidebar from '@/components/dashboard/layout/sidebar';
import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from "@/hooks/useStore"
import { useEffect } from "react"
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { stores, loading } = useStore()

  useEffect(() => {
    if (!loading) {
      // If we're already on the StoreSetupGuide page, don't redirect
      if (pathname === '/dashboard/StoreSetupGuide') {
        return;
      }

      // If there are no stores, redirect to StoreSetupGuide
      if (!stores?.length) {
        router.push('/dashboard/StoreSetupGuide');
        return;
      }

      // If we're on the main dashboard and have stores, redirect to first store
      if (pathname === '/dashboard' && stores.length > 0) {
        router.push(`/dashboard/${stores[0].id}`);
      }
    }
  }, [loading, stores, pathname, router]);

  // If we're on the StoreSetupGuide page or developers page, render without layout
  if (pathname === '/dashboard/StoreSetupGuide' || pathname.includes('/developers')) {
    return <main>{children}</main>;
  }

  if (loading) {
    return (
      <LoadingSpinner 
        size="lg"
        text="Loading your stores..."
        fullScreen
      />
    );
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <DashboardHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
