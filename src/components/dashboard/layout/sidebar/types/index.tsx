import { LucideIcon } from 'lucide-react'

export interface MenuItem {
  icon: LucideIcon
  text: string
  href: string
  active: boolean
}

export interface DarkModeToggleProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}