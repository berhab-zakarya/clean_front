"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// This type represents the data structure we'll receive from the database
type SpendingData = {
  month: string
  amount: number
  maxAmount: number
}

type SpendingStatisticsProps = {
  data: SpendingData[]
  year: number
  onYearChange: (year: number) => void
  className?: string
}

export default function SpendingStatistics({ data, year, onYearChange, className }: SpendingStatisticsProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const chartRef = useRef<HTMLDivElement>(null)

  // Format the data for the chart
  const chartData = data.map((item, index) => ({
    name: item.month,
    value: item.amount,
    index,
  }))

  // Format currency values
  const formatYAxis = (value: number) => {
    if (value >= 1000) return `DZD${value / 1000}k`
    return `DZD${value}`
  }

  // Get the short month name
  const getMonthName = (month: string) => {
    return month.substring(0, 3)
  }

  // Custom event handler for the chart container
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!chartRef.current) return

    const chartBounds = chartRef.current.getBoundingClientRect()
    setTooltipPosition({
      x: event.clientX - chartBounds.left,
      y: event.clientY - chartBounds.top - 20, // Position above cursor
    })
  }

  return (
    <div className={cn("w-full space-y-6", className) + " font-['Outfit']"}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a8a]">Spending statistics</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-[#1e3a8a] text-[#1e3a8a]"
            onClick={() => onYearChange(year - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous year</span>
          </Button>
          <span className="text-xl font-medium text-[#1e3a8a]">{year}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-[#1e3a8a] text-[#1e3a8a]"
            onClick={() => onYearChange(year + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next year</span>
          </Button>
        </div>
      </div>

      <div
        ref={chartRef}
        className="h-[400px] w-full relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveBar(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }} barSize={30}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
              tickFormatter={getMonthName}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
              tickFormatter={formatYAxis}
              ticks={[500, 1000, 5000, 10000, 15000]}
            />
            <Bar
              dataKey="value"
              radius={[12, 12, 0, 0]}
              onMouseOver={(data) => {
                setActiveBar(data.index)
              }}
              onMouseOut={() => {
                setActiveBar(null)
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === "Jun" ? "#1e3a8a" : "#f97316"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Tooltip */}
        {activeBar !== null && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div
              className="rounded-lg text-white p-3 shadow-lg"
              style={{
                backgroundColor: chartData[activeBar]?.name === "Jun" ? "#1e3a8a" : "#f97316",
              }}
            >
              <div className="text-sm font-medium">Expense</div>
              <div className="text-xl font-bold">{chartData[activeBar]?.value.toLocaleString()} DZD</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
