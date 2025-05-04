"use client"

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpendingDonut } from "@/components/dashboard/statistics/spending-donut"
import SpendingStatisticsWithAPI from "@/components/dashboard/statistics/spending-statistics-with-api"
import BalanceCard from '../balance/balance-card'

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6 font-['Outfit']">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#1e3a8a] text-lg font-semibold mb-4">Total Income</CardTitle>
            <ArrowUp className="h-5 w-5 text-green-500"></ArrowUp>
          </CardHeader>
          <CardContent>
            <div className="bg-white h-full mt-4">
                  
        
              <div>
                <div className="flex items-baseline mb-2">
                  <span className="text-[#1e3a8a] text-3xl font-bold">50,530.00</span>
                  <span className="text-[#828282] text-xl  ml-2">(DZD)</span>
                </div>
              </div>
        
              <div className="mb-4">
                <p className="text-sm mt-2">
                  <span className="text-green-500 font-medium">20%</span>
                  <span className="text-muted-foreground"> increase compared to last week</span>
                </p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Expense Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[#1e3a8a] text-lg font-semibold mb-4">Total Expense</CardTitle>
            <ArrowDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            {/*<div className="text-3xl font-bold text-blue-900">
              19,760.00
              <span className="text-sm font-normal text-muted-foreground ml-2">(DZD)</span>
            </div>
            <p className="text-sm mt-2">
              <span className="text-red-500 font-medium">10%</span>
              <span className="text-muted-foreground"> decrease compared to last week</span>
            </p>*/}
            <div className="bg-white h-full mt-4">
                  
        
              <div>
                    <div className="flex items-baseline mb-2">
                      <span className="text-[#1e3a8a] text-3xl font-bold">19,760.00</span>
                      <span className="text-[#828282] text-xl  ml-2">(DZD)</span>
                    </div>
                  </div>
            
                  <div className="mb-4">
                    <p className="text-sm mt-2">
                      <span className="text-red-500 font-medium">10%</span>
                      <span className="text-muted-foreground"> decrease compared to last week</span>
                    </p>
                   </div>
                </div>
          </CardContent>
        </Card>

        {/* Your Balance Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center pb-2">
              <h1 className="text-[#1e3a8a] text-lg font-semibold">Your balance</h1>
              <Button variant="ghost" size="icon" className="text-[#1e3a8a]">
              <MoreHorizontal className="h-5 w-5" />
             </Button>
           </div>
          </CardHeader>
          <CardContent>
            <BalanceCard />
          </CardContent>
        </Card>
      </div>

      {/* Spending Statistics */}
          {/*  <SpendingStatistics data={[]} year={2025} onYearChange={function (year: number): void {
            throw new Error('Function not implemented.')
          } } />  */}
          <SpendingStatisticsWithAPI />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spend by Category */}
            <SpendingDonut />

        {/* Order Details */}
        <Card>
          <CardContent>
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-[#1e3a8a] text-2xl font-semibold">Order details</h1>
                <button className="text-[#828282]">
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-[#f8f9fc] rounded-lg p-4 mb-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex items-center">
            <h3 className="text-[#1e3a8a] font-medium">Customer name</h3>
            <button className="ml-2 text-[#828282]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6.5L8 10.5L12 6.5"
                  stroke="#828282"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <h3 className="text-[#1e3a8a] font-medium">Ordre delivry</h3>
            <button className="ml-2 text-[#828282]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6.5L8 10.5L12 6.5"
                  stroke="#828282"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <h3 className="text-[#1e3a8a] font-medium">Order date</h3>
            <button className="ml-2 text-[#828282]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6.5L8 10.5L12 6.5"
                  stroke="#828282"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <h3 className="text-[#1e3a8a] font-medium">Order total</h3>
            <button className="ml-2 text-[#828282]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6.5L8 10.5L12 6.5"
                  stroke="#828282"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <h3 className="text-[#1e3a8a] font-medium">Status</h3>
            <button className="ml-2 text-[#828282]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6.5L8 10.5L12 6.5"
                  stroke="#828282"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-0">
        {/* Row 1 */}
        <div className="grid grid-cols-5 gap-4 py-6 border-b border-gray-200">
          <div className="text-[#1e3a8a] font-medium">Cocorella Out</div>
          <div className="text-[#1e3a8a]">
            Les dahlias,
            <br />
            Tlemcen, Algérie
          </div>
          <div className="text-[#1e3a8a]">
            12.09.2019 -<br />
            12.53 PM
          </div>
          <div className="text-[#1e3a8a] font-medium">34,295 DZD</div>
          <div>
            <span className="inline-block px-6 py-2 bg-[#77c902] text-white font-medium rounded-full">Delivered</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-5 gap-4 py-6 border-b border-gray-200">
          <div className="text-[#1e3a8a] font-medium">Cocorella Out</div>
          <div className="text-[#1e3a8a]">
            Les dahlias,
            <br />
            Tlemcen, Algérie
          </div>
          <div className="text-[#1e3a8a]">
            12.09.2019 -<br />
            12.53 PM
          </div>
          <div className="text-[#1e3a8a] font-medium">34,295 DZD</div>
          <div>
            <span className="inline-block px-6 py-2 bg-[#f97316] text-white font-medium rounded-full">Pending</span>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-5 gap-4 py-6 border-b border-gray-200">
          <div className="text-[#1e3a8a] font-medium">Cocorella Out</div>
          <div className="text-[#1e3a8a]">
            Les dahlias,
            <br />
            Tlemcen, Algérie
          </div>
          <div className="text-[#1e3a8a]">
            12.09.2019 -<br />
            12.53 PM
          </div>
          <div className="text-[#1e3a8a] font-medium">34,295 DZD</div>
          <div>
            <span className="inline-block px-6 py-2 bg-[#ff4423] text-white font-medium rounded-full">Rejected</span>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <div className="text-[#1e3a8a] font-medium">4 Items per page</div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center border border-[#1e3a8a] rounded-md text-[#1e3a8a]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-[#1e3a8a] font-medium">1 of 42</span>
          <button className="w-10 h-10 flex items-center justify-center border border-[#1e3a8a] rounded-md text-[#1e3a8a]">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Missing ArrowRight component, let's add it
function ArrowRight(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
