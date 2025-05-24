import React, { useRef, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample data matching the chart
const sampleData = [
  { month: "Jan", amount: 10500, maxAmount: 15000 },
  { month: "Feb", amount: 2000, maxAmount: 15000 },
  { month: "Mar", amount: 12000, maxAmount: 15000 },
  { month: "Apr", amount: 8000, maxAmount: 15000 },
  { month: "May", amount: 3000, maxAmount: 15000 },
  { month: "Jun", amount: 15030, maxAmount: 15000 },
  { month: "Jul", amount: 5000, maxAmount: 15000 },
  { month: "Aug", amount: 7500, maxAmount: 15000 },
  { month: "Sep", amount: 13000, maxAmount: 15000 },
  { month: "Oct", amount: 7000, maxAmount: 15000 },
  { month: "Nov", amount: 4000, maxAmount: 15000 },
  { month: "Dec", amount: 1000, maxAmount: 15000 }
]

export default function SpendingStatistics() {
  const [activeBar, setActiveBar] = useState(null)
  const [activeBarPosition, setActiveBarPosition] = useState(null)
  const [year, setYear] = useState(2024)
  const chartRef = useRef(null)

  // Format the data for the chart - include background bar
  const chartData = sampleData.map((item, index) => ({
    name: item.month,
    value: item.amount,
    maxValue: item.maxAmount,
    index,
  }))

  // Format currency values for Y-axis
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${value / 1000}k`
    } else {
      return `$${value}`
    }
  }

  // Get the short month name
  const getMonthName = (month) => {
    return month.substring(0, 3)
  }

  const onYearChange = (newYear) => {
    setYear(newYear)
  }

  return (
    <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl ml-2 font-semibold text-blue-900">Spending statistics</h2>
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => onYearChange(year - 1)}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-xl font-semibold text-gray-900 min-w-[60px] text-center">{year}</span>
          <button
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => onYearChange(year + 1)}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        ref={chartRef}
        className="h-[400px] w-full relative bg-white"
        onMouseLeave={() => {
          setActiveBar(null)
          setActiveBarPosition(null)
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }} 
            barSize={12}
          >
            <CartesianGrid 
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 14 }}
              tickFormatter={getMonthName}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={formatCurrency}
              domain={[0, 15000]}
              ticks={[0, 1000, 5000, 10000, 15000]}
            />
           
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              barSize={12}
              background={{ fill: '#e5e7eb', radius: [8, 8, 0, 0] }}
              onMouseEnter={(data, index, event) => {
                setActiveBar(index)
                if (chartRef.current && event && event.target) {
                  const rect = event.target.getBoundingClientRect()
                  const chartRect = chartRef.current.getBoundingClientRect()
                  setActiveBarPosition({
                    x: rect.left + rect.width / 2 - chartRect.left,
                    y: rect.top - chartRect.top - 10,
                  })
                }
              }}
              onMouseLeave={() => {
                setActiveBar(null)
                setActiveBarPosition(null)
              }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activeBar === index ? "#1E3A8A" :  "#f97316"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Custom Tooltip */}
        {activeBar !== null && activeBarPosition !== null && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: `${activeBarPosition.x}px`,
              top: `${activeBarPosition.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div
              className="rounded-xl text-white px-4 py-3 shadow-lg relative text-center min-w-[100px]"
              style={{
                backgroundColor: "#1e40af" ,
              }}
            >
              <div className="text-sm font-medium opacity-90">Expense</div>
              <div className="text-lg font-bold">
                ${chartData[activeBar]?.value.toLocaleString('en-US')}
              </div>
              {/* Tooltip arrow */}
              <div 
                className="absolute left-1/2 top-full w-0 h-0 -translate-x-1/2"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `8px solid #1e40af`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}