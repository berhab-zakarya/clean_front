import { NextResponse } from 'next/server'
import type { SpendingData } from "@/lib/types"

export async function GET() {
  // Here you'll connect to your backend
  const data: SpendingData = {
    categories: [
      {
        id: "1",
        name: "Ads",
        amount: 1200,
        color: "#FF6B6B"
      },
      {
        id: "2",
        name: "Stock",
        amount: 400,
        color: "#4ECDC4"
      },
      {
        id: "3",
        name: "Delivery",
        amount: 200,
        color: "#45B7D1"
      }
    ],
    totalSpending: 1800
  }
  
  return NextResponse.json(data)
}