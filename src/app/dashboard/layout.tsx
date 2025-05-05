
import { DashboardHeader } from '@/components/dashboard/layout/dashboard-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Sidebar from '@/components/dashboard/layout/sidebar';
import { Outfit } from 'next/font/google';
import { ReactNode } from 'react';

const outfit = Outfit({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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