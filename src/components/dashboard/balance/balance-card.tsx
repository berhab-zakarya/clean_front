import { MoreHorizontal, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BalanceCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-[272px] w-[320px] ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#1e3a8a] text-lg font-semibold">Your balance</h1>
        <MoreHorizontal className="h-5 w-5 text-[#828282]" />
      </div>

      <div>
        <div className="flex items-baseline mb-2">
          <span className="text-[#1e3a8a] text-3xl font-bold">${"120,435.00"}</span>
          <span className="text-[#828282] text-xl ml-2">(DZD)</span>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-[#828282] text-sm">From Jan 01, 2025 to Jan 31, 2025</p>
      </div>

      <div className="flex mt-10 gap-4">
        <Button className="flex-1 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-full py-6">
          <DollarSign className="mr-2 h-4 w-4" />
          Top Up
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a]/10 rounded-full py-6">
          <DollarSign className="mr-2 h-4 w-4" />
          Transfer
        </Button>
      </div>
    </div>
  )
}