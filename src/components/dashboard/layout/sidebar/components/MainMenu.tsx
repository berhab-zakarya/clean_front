"use client"
import { usePathname } from 'next/navigation'
import { MenuItem } from "./MenuItem"
import { mainMenuItems } from "../config/menu-items"

export const MainMenu = () => {
  const pathname = usePathname()

  return (
    <div className="transform transition-all duration-300 hover:translate-x-1">
      <h3 className="text-[14px] font-medium text-[#828282] mb-4 transition-colors duration-300 hover:text-gray-700">
        Main Menu
      </h3>
      <nav className="space-y-4">
        {mainMenuItems.map((item, index) => {
          const isActive = pathname === item.href
          
          return (
            <div 
              key={index} 
              className="transform transition-all duration-300 hover:translate-x-2 hover:bg-gray-50 rounded-lg"
            >
              <MenuItem {...item} active={isActive} />
            </div>
          )
        })}
      </nav>
    </div>
  )
}