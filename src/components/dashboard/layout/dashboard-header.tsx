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
                  className="group flex items-center w-full relative overflow-hidden p-4 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                >
                  {/* Animated Background Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 p-0.5">
                      <div className="w-full h-full bg-white rounded-2xl"></div>
                    </div>
                  </div>

                  {/* Icon Container with Enhanced Effects */}
                  <div className="relative z-10">
                    {/* Pulsing Background Circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>

                    {/* Icon Background */}
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                      <Store className="h-6 w-6 text-white transition-all duration-300 group-hover:scale-110" />

                      {/* Sparkle Effects */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 animate-ping"></div>
                    </div>
                  </div>

                  {/* Enhanced Text */}
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-500 group-hover:to-orange-600 transition-all duration-500 relative z-10 ml-4 flex-1">
                    Create New Store
                  </span>

                  {/* Enhanced Action Button */}
                  <div className="ml-auto relative z-10">
                    {/* Button Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                    {/* Main Button */}
                    <div className="relative w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-180">
                      <span className="text-white text-lg font-bold transition-transform duration-300 group-hover:rotate-180">
                        +
                      </span>
                    </div>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"></div>
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
                    {userData?.user?.profile?.business_name ||
                      userData?.user?.email?.split("@")[0]}
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
