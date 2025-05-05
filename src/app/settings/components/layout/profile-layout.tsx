"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronDown,
  CreditCard,
  Home,
  Lock,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
  BarChart3,
  PieChart,
  Inbox,
  HelpCircle,
  Moon,
  Sun
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const pathname = usePathname()

  // Apply dark mode when the state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-muted/40'} transition-colors duration-300`}>
      {/* Sidebar */}
       
      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
       

        {/* Profile Navigation */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'} border-b`}>
          <div className="container mx-auto px-4 md:px-6">
            <nav className="flex overflow-x-auto">
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium ${
                  pathname === "/dashboard/profile"
                    ? darkMode ? "border-orange-500 text-orange-500" : "border-primary text-primary"
                    : darkMode 
                      ? "border-transparent text-gray-400 hover:text-white hover:border-gray-500" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                Personal Account
              </Link>
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium ${
                  pathname === "/dashboard/settings"
                    ? darkMode ? "border-orange-500 text-orange-500" : "border-primary text-primary"
                    : darkMode 
                      ? "border-transparent text-gray-400 hover:text-white hover:border-gray-500" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                <Lock className="h-4 w-4" />
                Security
              </Link>
            </nav>
          </div>
        </div>

       
        <div className={`container mx-auto px-4 md:px-6 py-8 ${darkMode ? 'text-white' : ''}`}>{children}</div>
      </main>
    </div>
  )
}