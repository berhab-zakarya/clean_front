import { Headphones, Gift, LogOut } from "lucide-react"

export const SidebarFooter = () => {
  return (
    <div className="mt-auto p-6 space-y-4">
      <button className="w-full flex items-center justify-center py-3 px-4 rounded-full 
        bg-[#f3f5f7] text-[#1e3a8a] font-medium
        transition-all duration-300 ease-in-out
        hover:bg-[#1e3a8a] hover:text-white hover:shadow-md
        transform hover:scale-105">
        <Headphones className="w-5 h-5 mr-2 transition-colors duration-300" />
        Contact Support
      </button>

      <div className="border border-[#1e3a8a] rounded-lg p-4
        transition-all duration-300 ease-in-out
        hover:bg-[#f3f5f7] hover:shadow-md
        cursor-pointer transform hover:scale-102">
        <div className="flex items-center text-[#1e3a8a] font-medium mb-2">
          <Gift className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
          Free Gift Awaits You!
        </div>
        <div className="flex items-center justify-between text-[#1e3a8a]">
          <span>Upgrade your account</span>
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">&rsaquo;</span>
        </div>
      </div>

      <button className="w-full flex items-center text-[#ff4423] font-medium
        transition-all duration-300 ease-in-out
        hover:bg-red-50 hover:pl-2 rounded-lg p-2
        group">
        <LogOut className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="transition-colors duration-300 group-hover:text-red-600">Log Out</span>
      </button>
    </div>
  )
}