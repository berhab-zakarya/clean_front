import { MenuItem } from "./MenuItem"
import { mainMenuItems } from "../config/menu-items"

export const MainMenu = () => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Main Menu</h3>
      <nav className="space-y-4">
        {mainMenuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </nav>
    </div>
  )
}