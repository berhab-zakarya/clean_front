/*"use client"

import { useEffect, useState } from "react";
import SpendingStatistics from "./spending-statistics"

type SpendingData = {
  month: string
  amount: number
  maxAmount: number
}

const fetchData = async (year: number) => {
  setLoading(true);
  try {
    const response = await fetch(`../services/spending?year=${year}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }
    const spendingData = await response.json();
    console.log("Fetched data:", spendingData); // Debugging
    setData(spendingData);
  } catch (error) {
    console.error("Failed to fetch spending data:", error);
    // Fallback mock data
    const mockData: SpendingData[] = [
      { month: "January", amount: 500, maxAmount: 1000 },
      { month: "February", amount: 700, maxAmount: 1000 },
      { month: "March", amount: 300, maxAmount: 1000 },
    ];
    setData(mockData);
  } finally {
    setLoading(false);
  }
};

export default function SpendingStatisticsWithAPI() {
  const [data, setData] = useState<SpendingData[]>([])
  const [year, setYear] = useState(2024)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/spending?year=${year}`)
        const spendingData = await response.json()
        setData(spendingData)
      } catch (error) {
        console.error("Failed to fetch spending data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year])

  const handleYearChange = (newYear: number) => {
    setYear(newYear)
  }

  if (loading) {
    return (<div className="flex justify-center p-10">Loading spending data...</div>)
  }

  return <SpendingStatistics data={data} year={year} onYearChange={handleYearChange} />
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setData(spendingData: any) {
  throw new Error("Function not implemented.");
}

*/


"use client"

import { useState } from "react";
import SpendingStatistics from "./spending-statistics";

type SpendingData = {
  month: string;
  amount: number;
  maxAmount: number;
};

const hardCodedData: SpendingData[] = [
  { month: "January", amount: 5000, maxAmount: 1000 },
  { month: "February", amount: 7000, maxAmount: 1000 },
  { month: "March", amount: 3000, maxAmount: 1000 },
  { month: "April", amount: 9000, maxAmount: 1000 },
  { month: "May", amount: 1200, maxAmount: 1500 },
  { month: "June", amount: 8000, maxAmount: 1000 },
  { month: "July", amount: 6000, maxAmount: 1000 },
  { month: "August", amount: 1100, maxAmount: 1500 },
  { month: "September", amount: 4000, maxAmount: 1000 },
  { month: "October", amount: 1000, maxAmount: 1500 },
  { month: "November", amount: 7000, maxAmount: 1000 },
  { month: "December", amount: 13000, maxAmount: 1500 },
];

export default function SpendingStatisticsWithAPI() {
  const [year, setYear] = useState(2024);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  return (
    <SpendingStatistics data={hardCodedData} year={year} onYearChange={handleYearChange} />
  );
}
