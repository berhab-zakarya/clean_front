"use client"

import { useEffect, useState } from "react"
import { fetchSpendingData } from "@/services/spending-stats/api"
import type { SpendingData, SpendingCategory } from "@/lib/types"

interface ChartSegment extends SpendingCategory {
  percentage: number
  dashArray: string 
  dashOffset: number
}

export function SpendingDonut() {
  const [data, setData] = useState<SpendingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const spendingData = await fetchSpendingData()
        if (mounted) {
          setData(spendingData)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to load spending data"))
          console.error("Failed to fetch spending data:", err) 
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const calculateChartSegments = (categories: SpendingCategory[], total: number): ChartSegment[] => {
    const CIRCLE_RADIUS = 45
    const circumference = 2 * Math.PI * CIRCLE_RADIUS
    let offset = 0

    return categories.map((category) => {
      const percentage = total > 0 ? (category.amount / total) * 100 : 0
      const dashLength = (percentage / 100) * circumference
      const dashArray = `${dashLength} ${circumference - dashLength}`
      const dashOffset = -offset

      offset += dashLength

      return {
        ...category,
        percentage,
        dashArray,
        dashOffset,
      }
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="font-['Outfit']">
        <div className="bg-white rounded-3xl p-6 shadow-lg lg:min-w-[400px] h-[600px] flex items-center justify-center">
          <div className="animate-pulse text-blue-800" role="status">
            <span>Loading spending data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="font-['Outfit']">
        <div className="bg-white rounded-3xl p-6 shadow-lg lg:min-w-[400px]">
          <div className="text-red-500" role="alert">
            {error?.message || "Something went wrong. Please try again."}
          </div>
        </div>
      </div>
    )
  }

  const chartSegments = calculateChartSegments(data.categories, data.totalSpending)

  return (
    <div className="font-['Outfit']">
      <div className="bg-white rounded-3xl p-6 shadow-lg lg:min-w-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-blue-800 text-2xl font-semibold">Spend by category</h2>
          <button 
            className="text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="More options"
          >
            <div className="flex space-x-0.5">
              <div className="w-1.5 h-1.5 bg-blue-800 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-800 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-800 rounded-full"></div>
            </div>
          </button>
        </div>

        <div className="relative flex justify-center items-center mb-10">
          <div className="w-64 h-64 relative">
            <svg 
              viewBox="0 0 100 100" 
              className="transform -rotate-90 w-full h-full"
              aria-label="Spending donut chart"
            >
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#f5f5f5" 
                strokeWidth="10" 
                role="presentation"
              />

              {chartSegments.map((segment) => (
                <circle
                  key={segment.id}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="10"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  className="transition-all duration-500 hover:stroke-opacity-80"
                  role="graphics-symbol"
                  aria-label={`${segment.name}: ${formatCurrency(segment.amount)}`}
                />
              ))}
            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <p className="text-gray-500 text-lg mb-1">Overall Spending</p>
              <p className="text-blue-800 text-3xl font-bold">{formatCurrency(data.totalSpending)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {chartSegments.map((category, index) => (
            <div 
              key={category.id} 
              className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full mr-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: category.color }}
                  role="presentation"
                />
                <span className={index === 0 ? "text-blue-800 font-medium" : "text-gray-500"}>
                  {category.name}
                </span>
              </div>
              <span className={index === 0 ? "font-semibold" : "text-gray-500"}>
                {formatCurrency(category.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpendingDonut