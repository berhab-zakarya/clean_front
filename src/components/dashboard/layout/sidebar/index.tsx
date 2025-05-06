"use client"

import { useState, useEffect } from "react"
import { MainMenu } from "./components/MainMenu"
import { PreferencesMenu } from "./components/PreferencesMenu"
import { SidebarFooter } from "./components/SidebarFooter"
import Logo from "@/components/common/Logo"
import { useStore } from "@/hooks/useStore"
import { LockIcon } from "lucide-react"

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

  // Show loading state
  if (loading) {
    return (
      <aside className="w-64 h-screen flex flex-col bg-white border-r border-gray-200 font-['Outfit']">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
        </div>
      </aside>
    );
  }

  console.log('Sidebar render - hasStore:', hasStore); // Debug log

  return (
    <aside className={`w-64 h-screen flex flex-col bg-white border-r border-gray-200 font-['Outfit'] relative`}>
      {!hasStore && (
        <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-50">
          <LockIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 font-medium text-center px-4">
            Create a store to unlock dashboard
          </p>
        </div>
      )}

      <div className={`p-6 ${!hasStore ? 'pointer-events-none' : ''}`}>
        <div className="flex justify-center mb-8">
          <a 
            href="#" 
            className="transform transition-all duration-300 hover:scale-105 hover:opacity-80"
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
      
      <SidebarFooter />
    </aside>
  );
}