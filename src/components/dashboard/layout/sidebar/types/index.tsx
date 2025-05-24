import { LucideIcon } from 'lucide-react'
import React from 'react'

export type IconType = LucideIcon | ((props: { active?: boolean }) => React.ReactElement)

export interface MenuItem {
  icon: IconType
  text: string
  href: string | ((storeId: string) => string)
  active: boolean
}

export interface DarkModeToggleProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}