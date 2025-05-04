import { Headphones, Gift, LogOut } from "lucide-react"

export const SidebarFooter = () => {
  return (
    <div className="mt-auto p-6 space-y-4">
      <button className="w-full flex items-center justify-center py-3 px-4 rounded-full bg-[#f3f5f7] text-[#1e3a8a] font-medium">
        <Headphones className="w-5 h-5 mr-2 text-[#1e3a8a]" />
        Contact Support
      </button>

      <div className="border border-[#1e3a8a] rounded-lg p-4">
        <div className="flex items-center text-[#1e3a8a] font-medium mb-2">
          <Gift className="w-5 h-5 mr-2" />
          Free Gift Awaits You!
        </div>
        <div className="flex items-center justify-between text-[#1e3a8a]">
          <span>Upgrade your account</span>
          <span className="text-lg">&rsaquo;</span>
        </div>
      </div>

      <button className="w-full flex items-center text-[#ff4423] font-medium">
        <LogOut className="w-5 h-5 mr-2" />
        Log Out
      </button>
    </div>
  )
}