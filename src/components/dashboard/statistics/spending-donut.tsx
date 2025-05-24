import { useState, useEffect } from 'react'

interface SpendingCategory {
  id: string
  name: string
  amount: number
  color: string
}

interface SpendingData {
  categories: SpendingCategory[]
  totalSpending: number
}

interface ChartSegment extends SpendingCategory {
  percentage: number
  startAngle: number
  endAngle: number
  largeArcFlag: number
  x1: number
  y1: number
  x2: number
  y2: number
}

export  function SpendingDonut() {
  // Mock data matching the image
  const mockData: SpendingData = {
    totalSpending: 19760.00,
    categories: [
      { id: '1', name: 'Employees Salary', amount: 8000.00, color: '#FF6B9D' },
      { id: '2', name: 'Material Supplies', amount: 2130.00, color: '#FFB6C1' },
      { id: '3', name: 'Company tax', amount: 1510.00, color: '#8B5CF6' },
      { id: '4', name: 'Maintenance system', amount: 2245.00, color: '#6366F1' },
      { id: '5', name: 'Development System', amount: 4385.00, color: '#3B82F6' },
      { id: '6', name: 'Production Tools', amount: 1000.00, color: '#A78BFA' },
    ]
  }

  const [data, setData] = useState<SpendingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const calculateChartSegments = (categories: SpendingCategory[], total: number): ChartSegment[] => {
    const RADIUS = 35
    const CENTER = 50
    let currentAngle = 0

    return categories.map((category) => {
      const percentage = total > 0 ? (category.amount / total) * 100 : 0
      const angleSpan = (percentage / 100) * 360
      
      const startAngle = currentAngle
      const endAngle = currentAngle + angleSpan
      
      // Convert to radians for calculations
      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180
      
      // Calculate arc endpoints
      const x1 = CENTER + RADIUS * Math.cos(startRad)
      const y1 = CENTER + RADIUS * Math.sin(startRad)
      const x2 = CENTER + RADIUS * Math.cos(endRad)
      const y2 = CENTER + RADIUS * Math.sin(endRad)
      
      const largeArcFlag = angleSpan > 180 ? 1 : 0
      
      currentAngle = endAngle
      
      return {
        ...category,
        percentage,
        startAngle,
        endAngle,
        largeArcFlag,
        x1,
        y1,
        x2,
        y2,
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
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse text-gray-500 text-center">
            Loading spending data...
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const chartSegments = calculateChartSegments(data.categories, data.totalSpending)

  return (
    <div className="max-w-md mx-auto font-inter">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-gray-800 text-xl font-medium">Spend by category</h2>
          <button 
            className="text-gray-400 p-1 hover:text-gray-600 transition-colors"
            aria-label="More options"
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Donut Chart */}
        <div className="relative flex justify-center items-center mb-8">
          <div className="w-64 h-64 relative">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              aria-label="Spending donut chart"
            >
              {/* Background circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="35" 
                fill="none" 
                stroke="#f1f5f9" 
                strokeWidth="6"
                role="presentation"
              />

              {/* Data segments */}
              {chartSegments.map((segment) => {
                if (segment.percentage === 0) return null
                
                return (
                  <path
                    key={segment.id}
                    d={`M ${segment.x1} ${segment.y1} A 35 35 0 ${segment.largeArcFlag} 1 ${segment.x2} ${segment.y2}`}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="transition-all duration-300 hover:stroke-opacity-80"
                    role="graphics-symbol"
                    aria-label={`${segment.name}: ${formatCurrency(segment.amount)}`}
                  />
                )
              })}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
              <p className="text-gray-400 text-sm mb-1">Overall Spending</p>
              <p className="text-gray-800 text-2xl font-semibold">{formatCurrency(data.totalSpending)}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {chartSegments.map((category) => (
            <div 
              key={category.id} 
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                  role="presentation"
                />
                <span className="text-gray-600 text-sm">
                  {category.name}
                </span>
              </div>
              <span className="text-gray-800 text-sm font-medium">
                {formatCurrency(category.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}