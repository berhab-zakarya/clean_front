"use client"

import { useState } from "react"
import { MainMenu } from "./components/MainMenu"
import { PreferencesMenu } from "./components/PreferencesMenu"
import { SidebarFooter } from "./components/SidebarFooter"

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-gray-200 font-['Outfit']">
      <div className="p-6">
        <div className="flex justify-center mb-8">
          <a href="#">
            <img src="logo/svg/logo.svg" alt="ALGECOM logo" />
          </a>
        </div>

        <div className="space-y-8">
          <MainMenu />
          <PreferencesMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
      
      <SidebarFooter />
    </aside>
  )
}