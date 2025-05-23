"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import Image from 'next/image'

// Define types for our data
type OrderStatus = "Delivered" | "Pending" | "Rejected"

interface Order {
  id: string
  customerName: string
  email?: string
  phone: string
  address: {
    street: string
    city: string
    country: string
  }
  date: string
  total: string
  status: OrderStatus
}

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
  // State for statistics and orders
  const [stats, setStats] = useState<Statistics | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 20

  // Sorting state
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  // Filter states
  const [filters, setFilters] = useState({
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
            allOrders: 450,
            pending: 5,
            completed: 320,
            canceled: {
              count: 30,
              change: -20,
            },
            returned: 20,
            damaged: 5,
            abandonedCart: {
              percentage: 20,
              change: 0,
            },
            customers: 30,
          })
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching statistics:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/orders?page=${currentPage}&limit=${itemsPerPage}`)
        // const data = await response.json()

        // Simulating API response
        setTimeout(() => {
          // Generate 42 orders for pagination testing
          const generatedOrders: Order[] = Array.from({ length: 42 }, (_, i) => ({
            id: `order-${i + 1}`,
            customerName: "Cocorella Out",
            email: i % 3 === 0 ? undefined : "Hello@mail.com", // Some orders don't have email
            phone: "0770 00 00 00",
            address: {
              street: "Les dahlias",
              city: "Tlemcen",
              country: "Algérie",
            },
            date: "12.09.2019 - 12.53 PM",
            total: "34,295 DZD",
            status: i % 3 === 0 ? "Delivered" : i % 3 === 1 ? "Pending" : "Rejected",
          }))

          setOrders(generatedOrders)
          setTotalPages(Math.ceil(generatedOrders.length / itemsPerPage))
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage])

  // Apply filters to orders
  const filteredOrders = orders.filter((order) => {
    return (
      (filters.customerName === "" || order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) &&
      (filters.email === "" || (order.email && order.email.toLowerCase().includes(filters.email.toLowerCase()))) &&
      (filters.phone === "" || order.phone.includes(filters.phone)) &&
      (filters.address === "" ||
        `${order.address.street} ${order.address.city} ${order.address.country}`
          .toLowerCase()
          .includes(filters.address.toLowerCase())) &&
      (filters.date === "" || order.date.includes(filters.date)) &&
      (filters.total === "" || order.total.includes(filters.total)) &&
      (filters.status === "" || order.status === filters.status)
    )
  })

  // Handle sorting
  const handleSort = (key: SortKey) => {
    setSortConfigs((prevConfigs) => {
      // Check if the key is already in the sortConfigs
      const existingIndex = prevConfigs.findIndex(config => config.key === key);
      
      if (existingIndex !== -1) {
        // If key exists, toggle direction
        const newConfigs = [...prevConfigs];
        newConfigs[existingIndex] = {
          key,
          direction: newConfigs[existingIndex].direction === 'desc' ? 'asc' : 'desc'
        };
        return newConfigs;
      } else {
        // If key doesn't exist, add it with 'desc' direction
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
    // Apply each sort configuration in order
    for (const config of sortConfigs) {
      let comparison = 0;
      
      switch (config.key) {
        case 'customerName':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case 'email':
          // Handle undefined emails
          if (a.email === undefined && b.email === undefined) comparison = 0;
          else if (a.email === undefined) comparison = 1;
          else if (b.email === undefined) comparison = -1;
          else comparison = a.email.localeCompare(b.email);
          break;
        case 'phone':
          comparison = a.phone.localeCompare(b.phone);
          break;
        case 'address':
          const addressA = `${a.address.street} ${a.address.city} ${a.address.country}`;
          const addressB = `${b.address.street} ${b.address.city} ${b.address.country}`;
          comparison = addressA.localeCompare(addressB);
          break;
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'total':
          // Extract numeric value from total for proper numeric sorting
          const numA = parseFloat(a.total.replace(/[^0-9.]/g, ''));
          const numB = parseFloat(b.total.replace(/[^0-9.]/g, ''));
          comparison = numA - numB;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      // If items are different according to this sort key
      if (comparison !== 0) {
        // Apply sort direction
        return config.direction === 'desc' ? -comparison : comparison;
      }
    }
    
    // If all sort keys are equal, maintain original order
    return 0;
  });

  // Get current page orders
  const currentOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle filter change
  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

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
                    <span>Odre delivery</span>
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
                : currentOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a202c]">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.email ? (
                          <a href={`mailto:${order.email}`} className="text-[#1e3a8a] hover:underline">
                            {order.email}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No email</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">{order.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">
                        <div>
                          <p>{order.address.street},</p>
                          <p>
                            {order.address.city}, {order.address.country}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a202c]">{order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === "Delivered" ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#77c902] text-white">
                            Delivered
                          </span>
                        ) : order.status === "Pending" ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#fa8f45] text-white">
                            Pending
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#ff4423] text-white">
                            Rejected
                          </span>
                        )}
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
