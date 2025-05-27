"use client"

import { ChevronLeft, ChevronRight, Pencil } from "lucide-react"
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
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);

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

  // Add handleAcceptOrder function
  const handleAcceptOrder = async (orderId: number) => {
    try {
      await updateOrderStatus(orderId, 'processing');
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  // Add this function to handle clicking outside the menu
  useEffect(() => {
    const handleClickOutside = () => {
      if (openActionMenu !== null) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openActionMenu]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 md:p-6 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-[#1e3a8a]/10 flex items-center justify-center">
                <Image
                    src="/assets/icons/products.svg"
                    width={16}
                    height={16}
                    alt="product icon"
                    className="md:w-5 md:h-5"
                    style={{ filter: 'invert(19%) sepia(71%) saturate(2023%) hue-rotate(218deg) brightness(95%) contrast(93%)' }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-[#828282]">This week</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">All orders</p>
                <p className="text-lg md:text-xl font-bold">{stats?.allOrders}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Pending</p>
                <p className="text-lg md:text-xl font-bold">{stats?.pending}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Completed</p>
                <p className="text-lg md:text-xl font-bold">{stats?.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-[#1e3a8a]/10 flex items-center justify-center">
                <Image
                    src="/assets/icons/products.svg"
                    width={16}
                    height={16}
                    alt="product icon"
                    className="md:w-5 md:h-5"
                    style={{ filter: 'invert(19%) sepia(71%) saturate(2023%) hue-rotate(218deg) brightness(95%) contrast(93%)' }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-[#828282]">This week</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Canceled</p>
                <div className="flex items-center">
                  <p className="text-lg md:text-xl font-bold">{stats?.canceled.count}</p>
                  <span className="text-xs text-[#ff4423] ml-1">{stats?.canceled.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Returned</p>
                <p className="text-lg md:text-xl font-bold">{stats?.returned}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Damaged</p>
                <p className="text-lg md:text-xl font-bold">{stats?.damaged}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-[#1e3a8a]/10 flex items-center justify-center">
                <Image
                    src="/assets/icons/products.svg"
                    width={16}
                    height={16}
                    alt="product icon"
                    className="md:w-5 md:h-5"
                    style={{ filter: 'invert(19%) sepia(71%) saturate(2023%) hue-rotate(218deg) brightness(95%) contrast(93%)' }}
                />
              </div>
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-[#828282]">This week</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Abandoned cart</p>
                <div className="flex items-center">
                  <p className="text-lg md:text-xl font-bold">{stats?.abandonedCart.percentage}%</p>
                  <span className="text-xs text-[#77c902] ml-1">+{stats?.abandonedCart.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#828282] mb-1">Customers</p>
                <p className="text-lg md:text-xl font-bold">{stats?.customers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer orders table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6">
          <h2 className="text-base md:text-lg font-medium text-[#1a202c]">Customer orders</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-[#f3f5f7]">
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider hidden md:table-cell">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider hidden md:table-cell">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider hidden lg:table-cell">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
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
                    <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#828282] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </td>
                        </tr>
                      ))
                    : currentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a202c]">
                            {order.customer_name}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                            <a href={`mailto:${order.customer_email}`} className="text-[#1e3a8a] hover:underline">
                              {order.customer_email}
                            </a>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-[#1a202c] hidden md:table-cell">{order.customer_phone}</td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-[#1a202c] hidden lg:table-cell">
                            <div className="max-w-[200px]">
                              <p className="truncate" title={order.address}>
                                {order.address}
                              </p>
                              <p className="truncate text-gray-500" title={order.wilaya}>
                                {order.wilaya}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">{order.total_amount} DZD</td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap relative">
                            {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenu(openActionMenu === order.id ? null : order.id);
                                }}
                                className="p-1 md:p-2 text-gray-600 hover:text-[#1e3a8a] rounded-full hover:bg-gray-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                            
                            {openActionMenu === order.id && (
                              <div 
                                className="absolute right-0 mt-2 w-48 md:w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-2">
                                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    Order Actions
                                  </div>
                                  <div className="mt-1">
                                    {order.status === 'pending' && (
                                      <button
                                        onClick={() => {
                                          handleAcceptOrder(order.id);
                                          setOpenActionMenu(null);
                                        }}
                                        className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                      >
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <span>Accept Order</span>
                                      </button>
                                    )}
                                    {order.status === 'processing' && (
                                      <button
                                        onClick={() => {
                                          updateOrderStatus(order.id, 'shipped');
                                          setOpenActionMenu(null);
                                        }}
                                        className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                      >
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-6a1 1 0 00-.293-.707l-2-2A1 1 0 0017 4H3z" />
                                          </svg>
                                        </div>
                                        <span>Mark as Shipped</span>
                                      </button>
                                    )}
                                    {order.status === 'shipped' && (
                                      <button
                                        onClick={() => {
                                          updateOrderStatus(order.id, 'delivered');
                                          setOpenActionMenu(null);
                                        }}
                                        className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
                                      >
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-50 flex items-center justify-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <span>Mark as Delivered</span>
                                      </button>
                                    )}
                                    {(order.status === 'pending' || order.status === 'processing' || order.status === 'shipped') && (
                                      <button
                                        onClick={() => {
                                          updateOrderStatus(order.id, 'cancelled');
                                          setOpenActionMenu(null);
                                        }}
                                        className="w-full text-left px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150 border-t border-gray-100"
                                      >
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-50 flex items-center justify-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <span>Cancel Order</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Only show pagination if there are multiple pages */}
        {totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-xs md:text-sm text-[#828282]">{itemsPerPage} Items per page</div>
            <div className="flex items-center">
              <button
                className={`p-1 rounded-md border border-gray-300 mr-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 text-[#828282]" />
              </button>
              <span className="text-xs md:text-sm text-[#1a202c]">
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
  );
}
