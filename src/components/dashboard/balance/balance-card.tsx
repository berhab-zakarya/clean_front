import { MoreHorizontal } from "lucide-react"


export default function BalanceCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-[250px] w-[320px] ">
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

     
    </div>
  )
}