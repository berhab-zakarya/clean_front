"use client"

import { AuthProvider } from "@/lib/auth/AuthContext"
import { Toaster } from "@/components/ui/toaster"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}