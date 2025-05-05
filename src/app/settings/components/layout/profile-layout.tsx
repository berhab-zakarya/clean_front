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
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-border'} border-b p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className={`md:hidden ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' : ''}`}>
                <Image
                  src="/images/algecom-logo.png"
                  alt="Algecom Logo"
                  width={32}
                  height={32}
                  className="h-5 w-auto"
                />
              </Button>
              <div className="relative hidden md:block">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
                <Input placeholder="Search..." className={`pl-10 w-[300px] ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'bg-muted/50'}`} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className={darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' : ''}>
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700 text-white' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="bg-orange-400">ZJ</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">ZJ STORE</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
                  <DropdownMenuItem className={darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}>Profile</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}>Settings</DropdownMenuItem>
                  <DropdownMenuItem className={darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Profile Navigation */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'} border-b`}>
          <div className="container mx-auto px-4 md:px-6">
            <nav className="flex overflow-x-auto">
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium ${
                  pathname === "/profile"
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
                href="/profile/security"
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium ${
                  pathname === "/profile/security"
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

        {/* Page Content */}
        <div className={`container mx-auto px-4 md:px-6 py-8 ${darkMode ? 'text-white' : ''}`}>{children}</div>
      </main>
    </div>
  )
}