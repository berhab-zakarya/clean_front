import {
    Home,
    BarChart2,
    FileText,
    Package,
    Wallet,
    MessageSquare,
    Users,
    Settings,
    HelpCircle,
  } from "lucide-react"
  
  export const mainMenuItems = [
    { icon: Home, text: "Dashboard", href: "/dashboard", active: true },
    { icon: BarChart2, text: "Insight", href: "#", active: false },
    { icon: FileText, text: "Invoices", href: "/dashboard/invoice", active: false },
    { icon: Package, text: "Products", href: "#", active: false },
    { icon: Wallet, text: "Reimburse", href: "#", active: false },
    { icon: MessageSquare, text: "Inbox", href: "#", active: false },
    { icon: Users, text: "People & Teams", href: "#", active: false },
  ]
  
  export const preferencesItems = [
    { icon: Settings, text: "Settings", href: "/settings", active: false },
    { icon: HelpCircle, text: "Help & Center", href: "#", active: false },
  ]