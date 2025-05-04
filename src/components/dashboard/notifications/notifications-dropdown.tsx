"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
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

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-6 w-6 text-[#828282]" />
          {unreadCount > 0 && <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#fa8f45]"></span>}
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
        <div className="max-h-[300px] overflow-y-auto font-['Outfit']">
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
  )
}
