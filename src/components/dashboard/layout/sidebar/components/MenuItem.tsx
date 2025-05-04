import Link from "next/link"
import { MenuItem as MenuItemType } from "../types"

export const MenuItem = ({ icon: Icon, text, href, active }: MenuItemType) => {
  const textColor = active ? "text-[#1e3a8a]" : "text-[#828282]"
  const fontWeight = active ? "font-medium" : ""

  return (
    <Link href={href} className={`flex items-center ${textColor} ${fontWeight}`}>
      <div className={`w-8 h-8 flex items-center justify-center mr-3 ${textColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      {text}
    </Link>
  )
}