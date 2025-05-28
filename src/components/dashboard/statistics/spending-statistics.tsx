import React, { useRef, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, DollarSign } from "lucide-react"

interface ChartData {
  name: string;
  value: number;
  maxValue: number;
  index: number;
}

interface BarPosition {
  x: number;
  y: number;
}

export default function SpendingStatistics() {
  const [activeBar, setActiveBar] = useState<number | null>(null)
  const [activeBarPosition, setActiveBarPosition] = useState<BarPosition | null>(null)
  const [chartData] = useState<ChartData[]>([
    { name: 'Jan', value: 12500, maxValue: 15000, index: 0 },
    { name: 'Feb', value: 8200, maxValue: 15000, index: 1 },
    { name: 'Mar', value: 14800, maxValue: 15000, index: 2 },
    { name: 'Apr', value: 6300, maxValue: 15000, index: 3 },
    { name: 'May', value: 9800, maxValue: 15000, index: 4 },
    { name: 'Jun', value: 11200, maxValue: 15000, index: 5 },
    { name: 'Jul', value: 7500, maxValue: 15000, index: 6 },
    { name: 'Aug', value: 13400, maxValue: 15000, index: 7 },
    { name: 'Sep', value: 10600, maxValue: 15000, index: 8 },
    { name: 'Oct', value: 8900, maxValue: 15000, index: 9 },
    { name: 'Nov', value: 12100, maxValue: 15000, index: 10 },
    { name: 'Dec', value: 9400, maxValue: 15000, index: 11 }
  ])
  const chartRef = useRef<HTMLDivElement>(null)

  // Format currency values for Y-axis
  const formatCurrency = (value: number): string => {
    if (value >= 1000) {
      return `DZD${ value / 1000}k`
    } else {
      return `DZD${ value}`
    }
  }

  // Get the short month name
  const getMonthName = (month: string): string => {
    return month.substring(0, 3)
  }

  // Calculate total spending for summary
  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0)
  const averageSpending = totalSpending / chartData.length

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-white via-blue-50/30 to-orange-50/20 border border-gray-200/60 rounded-2xl shadow-xl backdrop-blur-sm">
      {/* Header Section with Enhanced Styling */}
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-1">Spending Statistics</h2>
              <p className="text-gray-600 text-sm">Track your monthly expenses</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
       
      </div>

      {/* Chart Section */}
      <div className="p-8 pt-0">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div
            ref={chartRef}
            className="h-[420px] w-full relative"
            onMouseLeave={() => {
              setActiveBar(null)
              setActiveBarPosition(null)
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 30, right: 30, left: 20, bottom: 30 }} 
                barSize={16}
              >
                <CartesianGrid 
                  vertical={false}
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
                  tickFormatter={getMonthName}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={formatCurrency}
                  domain={[0, 15000]}
                  ticks={[0, 1000, 5000, 10000, 15000]}
                  dx={-5}
                />
               
                <Bar
                  dataKey="value"
                  radius={12}
                  barSize={16}
                  background={{ fill: '#e5e7eb', radius: 12 }}
                  onMouseEnter={(data, index, event) => {
                    setActiveBar(index)
                    if (chartRef.current && event && event.target instanceof Element) {
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
                      fill={activeBar === index ? "#1E3A8A" : "#f97316"} 
                      style={{
                        filter: activeBar === index ? 'drop-shadow(0 4px 8px rgba(30, 58, 138, 0.3))' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Enhanced Custom Tooltip */}
            {activeBar !== null && activeBarPosition !== null && (
              <div
                className="absolute pointer-events-none z-50 animate-in fade-in duration-200"
                style={{
                  left: `${activeBarPosition.x}px`,
                  top: `${activeBarPosition.y}px`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div
                  className="rounded-2xl text-white px-5 py-4 shadow-2xl relative text-center min-w-[120px] backdrop-blur-sm"
                  style={{
                    backgroundColor: "#1e40af",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div className="text-sm font-medium opacity-90 mb-1">Monthly Expense</div>
                  <div className="text-xl font-bold">
                    DZD{chartData[activeBar]?.value.toLocaleString('en-US')}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {chartData[activeBar]?.name}
                  </div>
                  {/* Enhanced Tooltip arrow */}
                  <div 
                    className="absolute left-1/2 top-full w-0 h-0 -translate-x-1/2"
                    style={{
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: `10px solid #1e40af`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}