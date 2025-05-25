import Image from 'next/image'
import { dashboard, insight, customers, products, inbox, settings, help } from '@/lib/icons'
import { LucideIcon } from 'lucide-react'
import { IconType } from '../types'

interface IconProps {
  active?: boolean
}

const iconComponent = (iconPath: string): IconType => {
  const IconComponent = ({ active }: IconProps) => {
    return (
      <Image 
        src={iconPath}
        alt="menu icon"
        width={20}
        height={20}
        className={`transition-all duration-200 ${
          active 
            ? 'brightness-0 saturate-100' 
            : 'brightness-0 saturate-100'
        }`}
        style={{
          filter: active 
          ? 'brightness(0) saturate(100%) invert(12%) sepia(84%) saturate(4718%) hue-rotate(217deg) brightness(92%) contrast(92%)' 
          : 'brightness(0) saturate(100%) invert(51%) sepia(0%) saturate(0%) hue-rotate(173deg) brightness(95%) contrast(87%)'
      }}
      />
    )
  }
  IconComponent.displayName = 'IconComponent'
  return IconComponent
}

export const mainMenuItems = [
  {
    icon: iconComponent(dashboard),
    text: "Dashboard",
    href: (storeId: string) => `/dashboard/${storeId}`,
    active: false
  },
  {
    icon: iconComponent(insight),
    text: "Store Seetings",
    href: (storeId: string) => `/dashboard/${storeId}/store-settings`,
    active: false
  },
  {
    icon: iconComponent(customers),
    text: "Orders",
    href: (storeId: string) => `/dashboard/${storeId}/orders`,
    active: false
  },
  {
    icon: iconComponent(products),
    text: "Products",
    href: (storeId: string) => `/dashboard/${storeId}/product`,
    active: false
  },

]

export const preferencesItems = [
  {
    icon: iconComponent(settings),
    text: "Settings",
    href: (storeId: string) => `/dashboard/${storeId}/settings`,
    active: false
  },
  {
    icon: iconComponent(help),
    text: "Help & Center",
    href: (storeId: string) => `/dashboard/help-center`,
    active: false
  },
]