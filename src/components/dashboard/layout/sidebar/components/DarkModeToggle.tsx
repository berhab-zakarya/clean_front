import { Moon, Sun } from "lucide-react"
import { DarkModeToggleProps } from "../types"

export const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <div className="flex items-center justify-between text-[#828282]">
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center mr-3 text-[#828282]">
          <Moon className="w-5 h-5" />
        </div>
        Dark Mode
      </div>
      <button
        onClick={toggleDarkMode}
        className="relative inline-flex h-6 w-11 items-center rounded-full border border-gray-300"
      >
        <span
          className={`${
            isDarkMode ? "translate-x-5" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out ${
            isDarkMode ? "bg-[#1e3a8a]" : "bg-[#f97316]"
          }`}
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4 text-white" />
          ) : (
            <Sun className="h-4 w-4 text-white" />
          )}
        </span>
      </button>
    </div>
  )
}