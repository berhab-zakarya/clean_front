import Link from "next/link"
import Image from "next/image"
import { MenuItem as MenuItemType } from "../types"

export const MenuItem = ({ icon: Icon, text, href, active, iconSrc }: MenuItemType & { iconSrc: string }) => {
  const textColor = active ? "text-[#1e3a8a]" : "text-[#828282]"
  const fontWeight = active ? "font-medium" : ""

  return (
    <Link href={href} className={`flex items-center ${textColor} ${fontWeight}`}>
      <div className="w-8 h-8 flex items-center justify-center mr-3">
        {iconSrc ? (
          <Image 
            src={iconSrc}
            alt={text}
            width={20}
            height={20}
            className={`transition-all duration-200 ${active ? 'opacity-100' : 'opacity-60'}`}
          />
        ) : (
          <Icon 
            className="w-5 h-5 bg-black" 
            stroke={active ? "#1e3a8a" : "#828282"}
            fill="none"
            strokeWidth={active ? 2 : 1.5}
          />
        )}
      </div>
      {text}
    </Link>
  )
}