"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useLogout";
import { useStore } from "@/hooks/useStore";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  ShoppingBag,
  User,
  Heart,
  CheckCheck,
  Store,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function DashboardHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [isSwitchingStore, setIsSwitchingStore] = useState(false);
  const { userData } = useUser();
  const { logout, isLoggingOut } = useLogout();
  const { stores } = useStore();
  const router = useRouter();
  const params = useParams();
  const currentStoreId = params.storeId as string;

  const currentStore = stores?.find(
    (store) => store.id.toString() === currentStoreId
  );

  const handleStoreSwitch = async (storeId: number) => {
    setIsSwitchingStore(true);
    try {
      await router.push(`/dashboard/${storeId}`);
    } finally {
      setIsSwitchingStore(false);
      setStoreOpen(false);
    }
  };

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
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full border-b border-[#f3f5f7] shadow-sm font-['Outfit']">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Store Switcher */}
          <DropdownMenu open={storeOpen} onOpenChange={setStoreOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group relative flex items-center gap-3 h-auto p-3 hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#f1f5f9] rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-100/50 border border-transparent hover:border-blue-100"
              >
                <div className="relative">
                  <Store className="h-5 w-5 text-[#1e3a8a] transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <span className="text-[#1e3a8a] font-semibold text-sm transition-colors duration-200 group-hover:text-blue-700">
                    {isSwitchingStore ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Switching...
                      </span>
                    ) : (
                      currentStore?.store_name || "Select Store"
                    )}
                  </span>
                  <span className="text-[#828282] text-xs transition-colors duration-200 group-hover:text-slate-500">
                    {stores?.length || 0} store{stores?.length !== 1 ? "s" : ""}{" "}
                    available
                  </span>
                </div>
                <ChevronDown
                  className="h-4 w-4 text-[#828282] transition-all duration-300 group-hover:text-blue-500"
                  style={{
                    transform: storeOpen
                      ? "rotate(180deg) scale(1.1)"
                      : "rotate(0deg) scale(1)",
                  }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-80 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-blue-100/20 rounded-2xl p-2 animate-in slide-in-from-top-2 duration-300"
            >
              <DropdownMenuLabel className="font-semibold text-slate-700 px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                Your Stores
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {stores?.map((store, index) => (
                  <DropdownMenuItem
                    key={store.id}
                    onClick={() => handleStoreSwitch(store.id)}
                    disabled={isSwitchingStore}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 m-1 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] relative overflow-hidden",
                      store.id.toString() === currentStoreId
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1e3a8a] border border-blue-200/50 shadow-sm"
                        : "hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 hover:shadow-md",
                      isSwitchingStore && "opacity-50 cursor-not-allowed"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Subtle gradient overlay for selected item */}
                    {store.id.toString() === currentStoreId && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
                    )}

                    <div className="relative">
                      <Store
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          store.id.toString() === currentStoreId
                            ? "text-[#1e3a8a] scale-110"
                            : "text-slate-400 group-hover:text-[#1e3a8a] group-hover:scale-105"
                        )}
                      />
                      {store.id.toString() === currentStoreId && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 relative z-10">
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          store.id.toString() === currentStoreId
                            ? "text-[#1e3a8a]"
                            : "text-slate-700 group-hover:text-slate-900"
                        )}
                      >
                        {store.store_name}
                      </span>
                      <span
                        className={cn(
                          "text-xs transition-colors duration-200 truncate max-w-[200px]",
                          store.id.toString() === currentStoreId
                            ? "text-blue-600/70"
                            : "text-[#828282] group-hover:text-slate-500"
                        )}
                      >
                        {store.store_url}
                      </span>
                    </div>

                    {isSwitchingStore &&
                      store.id.toString() === currentStoreId && (
                        <div className="relative z-10">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}

                    {store.id.toString() === currentStoreId &&
                      !isSwitchingStore && (
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse relative z-10"></div>
                      )}
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />

              <DropdownMenuItem
                asChild
                className="group flex items-center gap-3 px-4 py-3 m-1 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md border border-transparent hover:border-green-200/50"
              >
                <Link
                  href="/dashboard/StoreSetupGuide"
                  className="flex items-center w-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Store className="h-5 w-5 text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                  </div>
                  <span className="text-sm font-medium text-green-700 group-hover:text-green-800 transition-colors duration-200 relative z-10">
                    Create New Store
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        </div>

        <div className="flex items-center gap-4 ml-4">
          {/* Notifications Dropdown */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full"
              >
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-[#1e3a8a]"
                >
                  Mark all as read
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 hover:bg-[#f3f5f7]"
                  >
                    <div className="flex gap-2">
                      <div
                        className={cn(
                          "mt-1 h-2 w-2 rounded-full shrink-0",
                          notification.read ? "bg-transparent" : "bg-[#fa8f45]"
                        )}
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {notification.title}
                        </div>
                        <div className="text-xs text-[#828282] mt-1">
                          {notification.description}
                        </div>
                        <div className="text-xs text-[#828282] mt-1">
                          {notification.time}
                        </div>
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
              <Button
                variant="ghost"
                className="flex items-center gap-3 h-auto p-2 hover:bg-[#f3f5f7] rounded-lg transition-all duration-200"
              >
                {userData?.user?.profile?.profile_image_url ? (
                  <img
                    src={userData.user.profile.profile_image_url}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#f3f5f7]"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-white font-bold shadow-sm">
                    {userData?.user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-[#1e3a8a] font-semibold text-sm">
                    {userData?.user?.profile?.business_name || "Loading..."}
                  </span>
                  <span className="text-[#828282] text-xs">
                    {userData?.user?.email?.split("@")[0]}
                  </span>
                </div>
                <ChevronDown
                  className="h-4 w-4 text-[#828282] transition-transform duration-200"
                  style={{
                    transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              <div className="px-4 py-4 bg-gradient-to-br from-[#f3f5f7] to-white rounded-lg mb-2">
                <p className="text-sm font-semibold text-[#1e3a8a]">
                  {userData?.user?.profile?.business_name ||
                    userData?.user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-[#828282] mt-1">
                  {userData?.user?.email}
                </p>
                {userData?.user?.profile?.phone_number && (
                  <p className="text-xs text-[#828282] mt-1">
                    {userData.user.profile.phone_number}
                  </p>
                )}
              </div>
              <DropdownMenuSeparator className="my-2" />
              <div className="space-y-1">
                <DropdownMenuItem
                  asChild
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors"
                >
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center w-full"
                  >
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
                <DropdownMenuItem
                  asChild
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#f3f5f7] cursor-pointer transition-colors"
                >
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center w-full"
                  >
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
                <LogOut
                  className={`h-4 w-4 ${isLoggingOut ? "animate-spin" : ""}`}
                />
                <span className="text-sm">
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
