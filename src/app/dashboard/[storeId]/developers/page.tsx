"use client"

import { VSCodeExplorer } from "@/components/vscode/vscode-explorer"
import { useStore } from "@/hooks/useStore"
import { useStorePath } from "@/hooks/useStorePath"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export default function DevelopersPage() {
  const { stores, loading } = useStore()
  const { currentStoreId } = useStorePath()
  
  const currentStore = stores?.find(store => store.id.toString() === currentStoreId)
  const subdomain = currentStore?.subdomain

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!subdomain) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error: Store not found</p>
          <p>Please make sure you have selected a valid store.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <VSCodeExplorer tenantName={subdomain} />
    </div>
  )
}
