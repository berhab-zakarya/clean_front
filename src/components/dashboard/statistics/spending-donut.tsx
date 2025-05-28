import { useState, useEffect } from 'react'
import { useStatistics } from '../../../hooks/useStatistics'
import { useStorePath } from '../../../hooks/useStorePath'
import { useStore } from '../../../hooks/useStore'
import Image from 'next/image'
import { StatisticsSnapshot } from '../../../lib/types/statistics'

interface TopProduct {
  id: number
  name: string
  price: string
  currency: string
  category_name: string
  primary_image: {
    id: number
    image_url: string
    alt_text: string
  } | null
  order_count: number
}

interface StatisticsData {
  id: number
  period: string
  start_date: string
  end_date: string
  total_orders: number
  total_sales_amount: string
  average_order_value: string
  top_products_details: TopProduct[]
}

export function SpendingDonut() {
  const [data, setData] = useState<StatisticsSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const { getSnapshots } = useStatistics()
  const { currentStoreId } = useStorePath()
  const { stores, loading: storesLoading } = useStore()

  useEffect(() => {
    const fetchData = async () => {
      if (storesLoading) return

      try {
        const selectedStore = stores?.find(
          (store) => store.id.toString() === currentStoreId
        )
        const storeUrl = selectedStore?.store_url

        if (!storeUrl) {
          console.error('Store URL not found')
          setLoading(false)
          return
        }

        const snapshots = await getSnapshots(storeUrl)
        console.log('Fetched snapshots:', snapshots)
        setData(snapshots)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentStoreId, stores, storesLoading, getSnapshots])

  if (loading || storesLoading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-300 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-gray-600 text-center font-medium">
              Loading top products...
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get the most recent daily statistics
  const latestDailyStats = data.find(stat => stat.period === 'daily')
  console.log('Latest daily stats:', latestDailyStats)
  
  const topProducts = latestDailyStats?.top_products_details || []
  console.log('Top products:', topProducts)

  return (
    <div className="max-w-md mx-auto font-inter">
      <div className="bg-gradient-to-br from-white via-gray-50/30 to-white rounded-3xl p-8 shadow-xl border border-gray-100/50 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/20 to-orange-100/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-gray-800 text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
              Top Products
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-600 bg-gray-100/80 px-3 py-1 rounded-full">
              {new Date(latestDailyStats?.start_date || '').toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4 relative z-10">
          {topProducts.map((product, index) => {
            console.log('Rendering product:', product)
            return (
              <div 
                key={product.id}
                className="group flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100/50 hover:border-gray-200/80 hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {product.primary_image ? (
                      <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <Image
                          src={product.primary_image?.image_url ? `http://127.0.0.1:8000${product.primary_image.image_url}` : '/no_placeHolder.jpg'}
                          alt={product.primary_image?.alt_text || product.name}
                          className="w-14 h-14 object-cover group-hover:scale-110 transition-transform duration-300"
                          width={56}
                          height={56}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 font-semibold text-sm truncate group-hover:text-gray-900 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50">
                        {product.category_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-gray-900 font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(parseFloat(product.price))}
                  </p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-600">
                      {product.order_count} orders
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {topProducts.length === 0 && (
          <div className="text-center py-12 relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No products data available</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for insights</p>
          </div>
        )}
      </div>
    </div>
  )
}