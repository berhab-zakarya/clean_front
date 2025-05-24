import { usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"

export const useStorePath = () => {
  const pathname = usePathname()
  const router = useRouter()

  // Get current store ID from path
  const getCurrentStoreId = useCallback(() => {
    const match = pathname.match(/\/dashboard\/(\d+)/)
    return match ? match[1] : null
  }, [pathname])

  // Switch to different store
  const switchStore = useCallback((storeId: number) => {
    const newPath = pathname.replace(/\/dashboard\/\d+/, `/dashboard/${storeId}`)
    router.push(newPath)
  }, [pathname, router])

  // Check if current path is store specific
  const isStorePath = useCallback(() => {
    return /^\/dashboard\/\d+/.test(pathname)
  }, [pathname])

  return {
    currentStoreId: getCurrentStoreId(),
    switchStore,
    isStorePath,
  }
} 