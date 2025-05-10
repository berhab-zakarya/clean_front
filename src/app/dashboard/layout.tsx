'use client';

import { DashboardHeader } from '@/components/dashboard/layout/dashboard-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Sidebar from '@/components/dashboard/layout/sidebar';
import { Outfit } from 'next/font/google';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const outfit = Outfit({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isMinimalView = pathname === '/dashboard/StoreSetupGuide/test2';

  if (isMinimalView) {
    return <main>{children}</main>;
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
