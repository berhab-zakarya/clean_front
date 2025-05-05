"use client"

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
  useTokenRefresh();
  return <>{children}</>;
}