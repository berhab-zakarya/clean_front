"use client"

import { AuthProvider } from "@/lib/auth/AuthContext"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
   
        {children}
   
    </AuthProvider>
  );
}