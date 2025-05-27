import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

export function OrderDetails() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-center items-center h-40">
          <div className="text-blue-900">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-center items-center h-40">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-blue-900 text-2xl font-semibold">
            Order details
          </h1>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </div>

        {/* Table Header */}
        <div className="bg-gray-50 rounded-lg px-6 py-4 mb-1">
          <div className="grid grid-cols-5 gap-6">
            <div className="flex items-center">
              <span className="text-blue-900 font-medium text-sm">
                Customer name
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center">
              <span className="text-blue-900 font-medium text-sm">
                Order delivery
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center">
              <span className="text-blue-900 font-medium text-sm">
                Order date
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center">
              <span className="text-blue-900 font-medium text-sm">
                Order total
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center">
              <span className="text-blue-900 font-medium text-sm">
                Status
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="bg-white">
          {orders.map((order) => (
            <div key={order.id} className="grid grid-cols-5 gap-6 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="text-blue-900 font-medium text-sm">
                {order.customer_name}
              </div>
              <div className="text-blue-900 text-sm">
                {order.address}
              </div>
              <div className="text-blue-900 text-sm">
                {new Date(order.created_at).toLocaleDateString()} -<br />
                {new Date(order.created_at).toLocaleTimeString()}
              </div>
              <div className="text-blue-900 font-semibold text-sm">
                {order.total_amount} DZD
              </div>
              <div>
                <span className={`inline-flex items-center px-4 py-1.5 text-white text-xs font-medium rounded-full ${
                  order.status === 'delivered' ? 'bg-green-500' :
                  order.status === 'pending' ? 'bg-orange-500' :
                  order.status === 'processing' ? 'bg-blue-500' :
                  order.status === 'shipped' ? 'bg-purple-500' :
                  'bg-red-500'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 px-6">
          <div className="text-blue-900 font-medium text-sm">
            {orders.length} Items
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center border border-blue-900 rounded-md text-blue-900 hover:bg-blue-50 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-blue-900 font-medium text-sm px-2">
              1 of {Math.ceil(orders.length / 4)}
            </span>
            <button className="w-9 h-9 flex items-center justify-center border border-blue-900 rounded-md text-blue-900 hover:bg-blue-50 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}