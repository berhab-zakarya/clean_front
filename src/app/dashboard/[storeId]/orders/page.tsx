"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import Image from 'next/image'
import { useOrders } from "@/hooks/useOrders"

interface Statistics {
  allOrders: number
  pending: number
  completed: number
  canceled: {
    count: number
    change: number
  }
  returned: number
  damaged: number
  abandonedCart: {
    percentage: number
    change: number
  }
  customers: number
}

// Define the sorting configuration type
type SortKey = 'customerName' | 'email' | 'phone' | 'address' | 'date' | 'total' | 'status';

interface SortConfig {
  key: SortKey;
  direction: 'desc' | 'asc';
}

export default function Orders() {
  const { orders, loading, error } = useOrders();

  // State for statistics
  const [stats, setStats] = useState<Statistics | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const totalPages = Math.ceil(orders.length / itemsPerPage)

  // Sorting state
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  // Filter states
  const [filters] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    total: "",
    status: "",
  })

  // Fetch statistics from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/statistics')
        // const data = await response.json()

        // Simulating API response
        setTimeout(() => {
          setStats({
            allOrders: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            completed: orders.filter(o => o.status === 'delivered').length,
            canceled: {
              count: orders.filter(o => o.status === 'cancelled').length,
              change: -20,
            },
            returned: 20,
            damaged: 5,
            abandonedCart: {
              percentage: 20,
              change: 0,
            },
            customers: new Set(orders.map(o => o.customer.id)).size,
          })
        }, 500)
      } catch (error) {
        console.error("Error fetching statistics:", error)
      }
    }

    if (orders.length > 0) {
      fetchStats()
    }
  }, [orders])

  // Apply filters to orders
  const filteredOrders = orders.filter((order) => {
    return (
      (filters.customerName === "" || order.customer_name.toLowerCase().includes(filters.customerName.toLowerCase())) &&
      (filters.email === "" || order.customer_email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.phone === "" || order.customer_phone.includes(filters.phone)) &&
      (filters.address === "" || order.address.toLowerCase().includes(filters.address.toLowerCase())) &&
      (filters.date === "" || order.created_at.includes(filters.date)) &&
      (filters.total === "" || order.total_amount.includes(filters.total)) &&
      (filters.status === "" || order.status === filters.status)
    )
  })

  // Handle sorting
  const handleSort = (key: SortKey) => {
    setSortConfigs((prevConfigs) => {
      const existingIndex = prevConfigs.findIndex(config => config.key === key);
      
      if (existingIndex !== -1) {
        const newConfigs = [...prevConfigs];
        newConfigs[existingIndex] = {
          key,
          direction: newConfigs[existingIndex].direction === 'desc' ? 'asc' : 'desc'
        };
        return newConfigs;
      } else {
        return [...prevConfigs, { key, direction: 'desc' }];
      }
    });
  };

  // Get direction for a specific key
  const getSortDirection = (key: SortKey) => {
    const config = sortConfigs.find(config => config.key === key);
    return config ? config.direction : null;
  };

  // Sort the filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    for (const config of sortConfigs) {
      let comparison = 0;
      
      switch (config.key) {
        case 'customerName':
          comparison = a.customer_name.localeCompare(b.customer_name);
          break;
        case 'email':
          comparison = a.customer_email.localeCompare(b.customer_email);
          break;
        case 'phone':
          comparison = a.customer_phone.localeCompare(b.customer_phone);
          break;
        case 'address':
          comparison = a.address.localeCompare(b.address);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'total':
          comparison = parseFloat(a.total_amount) - parseFloat(b.total_amount);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      if (comparison !== 0) {
        return config.direction === 'desc' ? -comparison : comparison;
      }
    }
    
    return 0;
  });

  // Get current page orders
  const currentOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a202c]">Orders summary</h1>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-md bg-[#1e3a8a]/10 flex items-center justify-center">
                <Image
                    src="/assets/icons/products.svg"
                    width={20}
                    height={20}
                    alt="product icon"
                    style={{ filter: 'invert(19%) sepia(71%) saturate(2023%) hue-rotate(218deg) brightness(95%) contrast(93%)' }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-[#828282]">This week</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-[#828282] mb-1">All orders</p>
                <p className="text-xl font-bold">{stats?.allOrders}</p>
              </div>
              <div>
                <p className="text-sm text-[#828282] mb-1">Pending</p>
                <p className="text-xl font-bold">{stats?.pending}</p>
              </div>
              <div>
                <p className="text-sm text-[#828282] mb-1">Completed</p>
                <p className="text-xl font-bold">{stats?.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-md bg-[#1e3a8a]/10 flex items-center justify-center">
                <Image
                    src="/assets/icons/products.svg"
                    width={20}
                    height={20}
                    alt="product icon"
                    style={{ filter: 'invert(19%) sepia(71%) saturate(2023%) hue-rotate(218deg) brightness(95%) contrast(93%)' }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-[#828282]">This week</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-[#828282] mb-1">Canceled</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">{stats?.canceled.count}</p>
                  <span className="text-xs text-[#ff4423] ml-1">{stats?.canceled.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#828282] mb-1">Returned</p>
                <p className="text-xl font-bold">{stats?.returned}</p>
              </div>
              <div>
                <p className="text-sm text-[#828282] mb-1">Damaged</p>
                <p className="text-xl font-bold">{stats?.damaged}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-md bg-[#1e3a8a]/10 flex items-center justify-center">
                <Image
                    src="/assets/icons/products.svg"
                    width={20}
                    height={20}
                    alt="product icon"
                    style={{ filter: 'invert(19%) sepia(71%) saturate(2023%) hue-rotate(218deg) brightness(95%) contrast(93%)' }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-[#828282]">This week</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#828282] mb-1">Abandoned cart</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">{stats?.abandonedCart.percentage}%</p>
                  <span className="text-xs text-[#77c902] ml-1">+{stats?.abandonedCart.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#828282] mb-1">Customers</p>
                <p className="text-xl font-bold">{stats?.customers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer orders table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-medium text-[#1a202c]">Customer orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f3f5f7]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('customerName')}>
                    <span>Customer name</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('customerName') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('customerName') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('customerName') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('email')}>
                    <span>Email</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('email') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('email') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('email') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('phone')}>
                    <span>Phone</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('phone') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('phone') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('phone') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('address')}>
                    <span>Order delivery</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('address') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('address') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('address') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('date')}>
                    <span>Order date</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('date') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('date') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('date') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('total')}>
                    <span>Order total</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('total') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('total') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('total') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                    <span>Status</span>
                    <button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-1 ${getSortDirection('status') ? "text-[#1e3a8a]" : ""}`}
                      >
                        {getSortDirection('status') === 'asc' ? (
                          <path d="M7 15l5 5 5-5"></path>
                        ) : getSortDirection('status') === 'desc' ? (
                          <path d="M7 9l5-5 5 5"></path>
                        ) : (
                          <>
                            <path d="M7 15l5 5 5-5"></path>
                            <path d="M7 9l5-5 5 5"></path>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </td>
                    </tr>
                  ))
                : currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a202c]">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href={`mailto:${order.customer_email}`} className="text-[#1e3a8a] hover:underline">
                          {order.customer_email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">{order.customer_phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">
                        <div>
                          <p>{order.address}</p>
                          <p>{order.wilaya}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">{order.total_amount} DZD</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "delivered" 
                            ? "bg-[#77c902] text-white"
                            : order.status === "pending"
                            ? "bg-[#fa8f45] text-white"
                            : order.status === "processing"
                            ? "bg-[#1e3a8a] text-white"
                            : order.status === "shipped"
                            ? "bg-[#1e3a8a] text-white"
                            : "bg-[#ff4423] text-white"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Only show pagination if there are multiple pages */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-[#828282]">{itemsPerPage} Items per page</div>
            <div className="flex items-center">
              <button
                className={`p-1 rounded-md border border-gray-300 mr-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 text-[#828282]" />
              </button>
              <span className="text-sm text-[#1a202c]">
                {currentPage} of {totalPages}
              </span>
              <button
                className={`p-1 rounded-md border border-gray-300 ml-2 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4 text-[#828282]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
