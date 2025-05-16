"use client"

import { useState } from "react"
import { useUser } from "@/hooks/useUser"
import { useLogout } from "@/hooks/useLogout"
import Image from "next/image"
import { Search, Bell, ChevronDown, Settings, LogOut, ShoppingBag, User, Heart, CheckCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { StoreDropdown } from "./store-dropdown"


export function DashboardHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { userData, loading } = useUser()
  const { logout, isLoggingOut } = useLogout()

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New order received",
      description: "Order #12345 has been placed",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment successful",
      description: "Payment for order #12344 was successful",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Product restocked",
      description: "Wireless Headphones are back in stock",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "New review",
      description: "Someone left a 5-star review on Bluetooth Speaker",
      time: "Yesterday",
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="w-full border-b border-[#f3f5f7] shadow-sm font-['Outfit']">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#828282]" />
          </div>
          <input
            type="text"
            placeholder="Search something here"
            className="w-full py-2 pl-10 pr-4 rounded-full border border-[#f3f5f7] bg-[#f3f5f7] text-[#828282] focus:outline-none focus:ring-2 focus:ring-[#f3f5f7] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-4 ml-4">
          {/* Notifications Dropdown */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Image   
                  src="/assets/icons/sidebar/Notif.svg"
                  alt="Notification"
                  width={40}
                  height={40}
                  className="opacity-75 group-hover:opacity-100 transition-opacity "
                  />
                
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-3">
                <DropdownMenuLabel className="font-semibold text-base p-0">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </DropdownMenuLabel>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-[#1e3a8a]">
                  Mark all as read
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-2 hover:bg-[#f3f5f7]">
                    <div className="flex gap-2">
                      <div
                        className={cn(
                          "mt-1 h-2 w-2 rounded-full shrink-0",
                          notification.read ? "bg-transparent" : "bg-[#fa8f45]",
                        )}
                      />
                      <div>
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-[#828282] mt-1">{notification.description}</div>
                        <div className="text-xs text-[#828282] mt-1">{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-[#1e3a8a] font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-[#f3f5f7] rounded-lg transition-all duration-200">
                {userData?.user?.profile?.profile_image_url ? (
                  <img 
                    src={userData.user.profile.profile_image_url} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#f3f5f7]"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-white font-bold shadow-sm">
                    {userData?.user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-[#1e3a8a] font-semibold text-sm">
                    {userData?.user?.profile?.business_name || 'Loading...'}
                  </span>
                  <span className="text-[#828282] text-xs">
                    {userData?.user?.email?.split('@')[0]}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-[#828282] transition-transform duration-200" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              <div className="px-4 py-4 bg-gradient-to-br from-[#f3f5f7] to-white rounded-lg mb-2">
                <p className="text-sm font-semibold text-[#1e3a8a]">
                  {userData?.user?.profile?.business_name || userData?.user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-[#828282] mt-1">{userData?.user?.email}</p>
                {userData?.user?.profile?.phone_number && (
                  <p className="text-xs text-[#828282] mt-1">
                    {userData.user.profile.phone_number}
                  </p>
                )}
              </div>
              <DropdownMenuSeparator className="my-2" />
              <div className="space-y-1">
                <DropdownMenuItem asChild className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors">
                  <Link href="/dashboard/profile" className="flex items-center w-full">
                    <User className="h-4 w-4 text-[#1e3a8a]" />
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors">
                  <ShoppingBag className="h-4 w-4 text-[#1e3a8a]" />
                  <span className="text-sm">Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors">
                  <Heart className="h-4 w-4 text-[#1e3a8a]" />
                  <span className="text-sm">Saved Items</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors">
                  <CheckCheck className="h-4 w-4 text-[#1e3a8a]" />
                  <span className="text-sm">Completed Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors">
                  <Link href="/dashboard/settings" className="flex items-center w-full">
                    <Settings className="h-4 w-4 text-[#1e3a8a]" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem 
                onClick={logout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors text-red-500"
              >
                <LogOut className={`h-4 w-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  
        </div>
      </div>
 
    </header>
  )
}
