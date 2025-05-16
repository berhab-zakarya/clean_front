import Image from 'next/image'

const iconComponent = (iconPath: string) => {
  const IconComponent = () => {
    return (
      <Image 
        src={iconPath}
        alt="menu icon"
        width={20}
        height={20}
        className="opacity-75 group-hover:opacity-100 transition-opacity "
      />
    )
  }
  IconComponent.displayName = 'IconComponent'
  return IconComponent
}

export const mainMenuItems = [
  { 
    icon: iconComponent('/assets/icons/sidebar/dashboard.svg'), 
    text: "Dashboard", 
    href: "/dashboard", 
    active: true 
  },
  { 
    icon: iconComponent('/assets/icons/sidebar/insight_icon.svg'), 
    text: "Insight", 
    href: "#", 
    active: false 
  },
  { 
    icon: iconComponent('/assets/icons/sidebar/Customers.svg'), 
    text: "Customers", 
    href: "#/dashboard/Customers", 
    active: false 
  },
  { 
    icon: iconComponent('/assets/icons/sidebar/products_icon.svg'), 
    text: "Products", 
    href: "/dashboard/product", 
    active: false 
  },
  { 
    icon: iconComponent('/assets/icons/sidebar/inbox_icon.svg'), 
    text: "Inbox", 
    href: "#", 
    active: false 
  },
]

export const preferencesItems = [
  { 
    icon: iconComponent('/assets/icons/sidebar/setting_icon.svg'), 
    text: "Settings", 
    href: "/dashboard/settings", 
    active: false 
  },
  { 
    icon: iconComponent('/assets/icons/sidebar/help_center_icon.svg'), 
    text: "Help & Center", 
    href: "#", 
    active: false 
  },
]