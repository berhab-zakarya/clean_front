import Link from "next/link"
import { MenuItem as MenuItemType } from "../types"

export const MenuItem = ({ icon: Icon, text, href, active }: MenuItemType) => {
  const textColor = active ? "text-[#1e3a8a]" : "text-[#828282]"
  const fontWeight = active ? "font-medium" : ""
  
  // إضافة متغير للون الأيقونة
  const iconColor = active ? "#1e3a8a" : "#828282"

  return (
    <Link href={href} className={`flex items-center ${textColor} ${fontWeight}`}>
      <div className="w-8 h-8 flex items-center justify-center mr-3">
        <Icon 
          className="w-5 h-5" 
          stroke={iconColor}  // إضافة لون الـ stroke
          fill="none"         // تعيين fill إلى none للأيقونات الخطية
          strokeWidth={active ? 2 : 1.5} // جعل الخط أسمك قليلاً عندما يكون نشطاً
        />
      </div>
      {text}
    </Link>
  )
}