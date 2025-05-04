import type { SpendingData } from "@/lib/types"

const mockData: SpendingData = {
  totalSpending: 12500,
  categories: [
    {
      id: "1",
      name: "Groceries",
      amount: 5000,
      color: "#4F46E5"
    },
    {
      id: "2", 
      name: "Transportation",
      amount: 3000,
      color: "#EC4899"
    },
    {
      id: "3",
      name: "Entertainment",
      amount: 2500,
      color: "#10B981"
    },
    {
      id: "4",
      name: "Bills",
      amount: 2000,
      color: "#F59E0B"
    }
  ]
}

export async function fetchSpendingData(): Promise<SpendingData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return mockData
}


/*--------------------- When the backend is finished -----------------*/
/*
export async function fetchSpendingData(): Promise<SpendingData> {
  const response = await fetch('/api/spending-categories')
  if (!response.ok) {
    throw new Error('Failed to fetch spending data')
  }
  return response.json()
}
*/