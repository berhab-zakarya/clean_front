import Link from "next/link"
import { MenuItem as MenuItemType } from "../types"

export const MenuItem = ({ icon: Icon, text, href, active }: MenuItemType) => {
  const textColor = active ? "text-[#1E3A8A]" : "text-[#828282]"
  const fontWeight = active ? "font-medium" : ""

  return (
    <Link 
      href={typeof href === 'function' ? href('') : href}
      className={`flex items-center ${textColor} ${fontWeight}`}
    >
      <div className="w-8 h-8 flex items-center justify-center mr-3">
        {typeof Icon === 'function' ? (
          <Icon active={active} />
        ) : (
          <Icon 
            color={active ? "#1E3A8A" : "#828282"} 
            strokeWidth={active ? 2 : 1.5} 
          />
        )}
      </div>
      {text}
    </Link>
  )
}