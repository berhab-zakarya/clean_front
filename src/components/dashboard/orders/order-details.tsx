import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from "lucide-react";

export function OrderDetails() {
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
          {/* Row 1 */}
          <div className="grid grid-cols-5 gap-6 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-blue-900 font-medium text-sm">
              Cocorella Out
            </div>
            <div className="text-blue-900 text-sm">
              Les dahlias,<br />
              Tlemcen, Algérie
            </div>
            <div className="text-blue-900 text-sm">
              12.09.2019 -<br />
              12:53 PM
            </div>
            <div className="text-blue-900 font-semibold text-sm">
              34,295 DZD
            </div>
            <div>
              <span className="inline-flex items-center px-4 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full">
                Delivered
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-5 gap-6 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-blue-900 font-medium text-sm">
              Cocorella Out
            </div>
            <div className="text-blue-900 text-sm">
              Les dahlias,<br />
              Tlemcen, Algérie
            </div>
            <div className="text-blue-900 text-sm">
              12.09.2019 -<br />
              12:53 PM
            </div>
            <div className="text-blue-900 font-semibold text-sm">
              34,295 DZD
            </div>
            <div>
              <span className="inline-flex items-center px-4 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-full">
                Pending
              </span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-5 gap-6 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="text-blue-900 font-medium text-sm">
              Cocorella Out
            </div>
            <div className="text-blue-900 text-sm">
              Les dahlias,<br />
              Tlemcen, Algérie
            </div>
            <div className="text-blue-900 text-sm">
              12.09.2019 -<br />
              12:53 PM
            </div>
            <div className="text-blue-900 font-semibold text-sm">
              34,295 DZD
            </div>
            <div>
              <span className="inline-flex items-center px-4 py-1.5 bg-red-500 text-white text-xs font-medium rounded-full">
                Rejected
              </span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 px-6">
          <div className="text-blue-900 font-medium text-sm">
            4 Items per page
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center border border-blue-900 rounded-md text-blue-900 hover:bg-blue-50 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-blue-900 font-medium text-sm px-2">
              1 of 42
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