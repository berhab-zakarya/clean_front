'use client';


import { DashboardLoadingUI } from "@/components/common/DashboardLoadingUI";
import { useStore } from "@/hooks/useStore"
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { use } from 'react';

// Enhanced Loading Component


export default function StoreDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const router = useRouter();
  const { stores, loading } = useStore();
  const resolvedParams = use(params);

  useEffect(() => {
    if (!loading) {
      // Check if the store exists
      const storeExists = stores?.some(store => store.id.toString() === resolvedParams.storeId);
      if (!storeExists) {
        // If store doesn't exist, redirect to first store or dashboard
        if (stores?.length > 0) {
          router.push(`/dashboard/${stores[0].id}`);
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [loading, stores, resolvedParams.storeId, router]);

  if (loading) {
    return <DashboardLoadingUI />;
  }

  return (
    <main>{children}</main>
  );
}