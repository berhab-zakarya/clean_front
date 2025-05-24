"use client"
import { usePathname, useParams } from 'next/navigation'
import { MenuItem } from "./MenuItem"
import { mainMenuItems } from "../config/menu-items"

export const MainMenu = () => {
  const pathname = usePathname()
  const params = useParams()
  const storeId = params.storeId as string

  return (
    <div className="transform transition-all duration-300 hover:translate-x-1">
      <h3 className="text-[14px] font-medium text-[#828282] mb-4 transition-colors duration-300 hover:text-gray-700">
        Main Menu
      </h3>
      <nav className="space-y-4">
        {mainMenuItems.map((item, index) => {
          const href = typeof item.href === 'function' ? item.href(storeId) : item.href
          const isActive = pathname === href
          
          return (
            <div 
              key={index} 
              className="transform transition-all duration-300 hover:translate-x-2 hover:bg-gray-50 rounded-lg"
            >
              <MenuItem {...item} href={href} active={isActive} />
            </div>
          )
        })}
      </nav>
    </div>
  )
}