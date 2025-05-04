import { MenuItem } from "./MenuItem"
import { DarkModeToggle } from "./DarkModeToggle"
import { preferencesItems } from "../config/menu-items"
import { DarkModeToggleProps } from "../types"

export const PreferencesMenu = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Preferences</h3>
      <nav className="space-y-4">
        {preferencesItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </nav>
    </div>
  )
}