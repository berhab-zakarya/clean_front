"use client"

import { useState, useEffect } from "react"
import { MainMenu } from "./components/MainMenu"
import { PreferencesMenu } from "./components/PreferencesMenu"
import { SidebarFooter } from "./components/SidebarFooter"
import Logo from "@/components/common/Logo"
import { useStore } from "@/hooks/useStore"
import { LockIcon, ShieldAlertIcon } from "lucide-react"

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { hasStore, checkStoreExistence, loading, userStore } = useStore();
  
  useEffect(() => {
    const initializeSidebar = async () => {
      try {
        // Try to get cached store first
        const cachedStore = localStorage.getItem('userStore');
        if (cachedStore) {
          console.log('Found cached store:', cachedStore);
        }

        // Always check with API
        const storeExists = await checkStoreExistence();
        console.log('Store check result:', storeExists);

      } catch (error) {
        console.error('Sidebar initialization error:', error);
      }
    };

    initializeSidebar();
  }, [checkStoreExistence]);

  // Theme class based on dark mode
  const themeClass = isDarkMode 
    ? "bg-gray-900 text-gray-100 border-gray-700" 
    : "bg-white text-gray-800 border-gray-200";

  // Show loading state
  if (loading) {
    return (
      <aside className={`w-64 h-screen flex flex-col ${themeClass} border-r font-['Outfit']`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-blue-500"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`w-64 h-screen flex flex-col ${themeClass} border-r font-['Outfit'] relative shadow-sm`}>
      {!hasStore && (
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="flex flex-col items-center px-6 py-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
            <div className="bg-blue-500/20 p-4 rounded-full mb-4">
              <LockIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Dashboard Locked</h3>
            <p className="text-sm text-gray-200 font-medium text-center mb-4">
              Create a store to unlock all dashboard features
            </p>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium text-sm">
              Create Store
            </button>
          </div>
        </div>
      )}

      <div className={`p-6 ${!hasStore ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex justify-center mb-8">
          <a 
            href="#" 
            className="transform transition-all duration-300 hover:scale-105"
          >
            <div className="relative transition-transform duration-300 hover:rotate-2">
              <Logo />
            </div>
          </a>
        </div>

        <div className="space-y-8">
          <MainMenu />
          <PreferencesMenu isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        </div>
      </div>
      
      <div className="mt-auto">
        <SidebarFooter />
      </div>
    </aside>
  );
}