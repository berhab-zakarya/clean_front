"use client"

import { AuthProvider } from "@/lib/auth/AuthContext"
import { TokenRefreshProvider } from "@/components/providers/TokenRefreshProvider"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TokenRefreshProvider>
        {children}
      </TokenRefreshProvider>
    </AuthProvider>
  );
}