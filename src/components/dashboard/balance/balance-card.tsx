import { MoreHorizontal } from "lucide-react"
import { useStatistics } from "@/hooks/useStatistics"
import { useEffect, useState } from "react"
import { useStorePath } from "@/hooks/useStorePath"
import { useStore } from "@/hooks/useStore"

export default function BalanceCard() {
  const { getRealtimeStatistics } = useStatistics()
  const { currentStoreId } = useStorePath()
  const { stores } = useStore()
  const [totalSpending, setTotalSpending] = useState("0")
  const [averageMonthly, setAverageMonthly] = useState("0")
  const [dateRange, setDateRange] = useState("")

  useEffect(() => {
    const fetchStatistics = async () => {
      const selectedStore = stores?.find(
        (store) => store.id.toString() === currentStoreId
      )
      const storeUrl = selectedStore?.store_url

      if (!storeUrl) return

      try {
        const data = await getRealtimeStatistics(storeUrl, "monthly")
        if (data) {
          // Format numbers with commas and 2 decimal places
          const formattedTotal = parseFloat(data.total_sales_amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          const formattedAverage = parseFloat(data.average_order_value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          
          setTotalSpending(formattedTotal)
          setAverageMonthly(formattedAverage)
          
          // Format date range
          const startDate = new Date(data.start_date)
          const endDate = new Date(data.end_date)
          const formattedStartDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          const formattedEndDate = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          setDateRange(`${formattedStartDate} to ${formattedEndDate}`)
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
      }
    }

    if (currentStoreId && stores) {
      fetchStatistics()
    }
  }, [currentStoreId, stores, getRealtimeStatistics])

  // Calculate total balance by adding totalSpending and averageMonthly
  const calculateTotalBalance = () => {
    const total = parseFloat(totalSpending.replace(/,/g, ''))
    const average = parseFloat(averageMonthly.replace(/,/g, ''))
    const sum = total + average
    return sum.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-[250px] w-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[#1e3a8a] text-lg font-semibold">Your balance</h1>
        <MoreHorizontal className="h-5 w-5 text-[#828282]" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline">
            <span className="text-[#1e3a8a] text-3xl font-bold">{calculateTotalBalance()}</span>
            <span className="text-[#828282] text-xl ml-2">(DZD)</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[#828282] text-sm">{dateRange}</p>
      </div>
    </div>
  )
}