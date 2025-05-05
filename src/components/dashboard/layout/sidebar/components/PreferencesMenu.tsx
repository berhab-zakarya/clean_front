import { MenuItem } from "./MenuItem"
import { DarkModeToggle } from "./DarkModeToggle"
import { preferencesItems } from "../config/menu-items"
import { DarkModeToggleProps } from "../types"

export const PreferencesMenu = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <div className="transform transition-all duration-300 hover:translate-x-1">
      <h3 className="text-sm font-medium text-gray-500 mb-4 transition-colors duration-300 hover:text-gray-700">
        Preferences
      </h3>
      <nav className="space-y-4">
        {preferencesItems.map((item, index) => (
          <div 
            key={index} 
            className="transform transition-all duration-300 hover:translate-x-2 hover:bg-gray-50 rounded-lg"
          >
            <MenuItem {...item} />
          </div>
        ))}
        <div className="transform transition-all duration-300 hover:translate-x-2">
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </nav>
    </div>
  )
}