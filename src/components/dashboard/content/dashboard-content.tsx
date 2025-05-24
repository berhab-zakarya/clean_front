"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/hooks/useStore";
import { useStorePath } from "@/hooks/useStorePath";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent } from "@/components/ui/card";
import { SpendingDonut } from "@/components/dashboard/statistics/spending-donut";
import SpendingStatisticsWithAPI from "@/components/dashboard/statistics/spending-statistics-with-api";
import BalanceCard from "../balance/balance-card";
import { OrderDetails } from "../orders/order-details";
import { StatisticsCards } from "@/components/dashboard/statistics/statistics-cards";

export function DashboardContent() {
  // Get all stores and the current storeId from the URL
  const { stores } = useStore();
  const { currentStoreId } = useStorePath();
  const { getSnapshots, getRealtimeStatistics } = useStatistics();

  // State to hold statistics data
  const [snapshots, setSnapshots] = useState<StatisticsSnapshot[]>([]);
  const [realtimeStats, setRealtimeStats] = useState(null);

  // Find the selected store object
  const selectedStore = stores?.find(
    (store) => store.id.toString() === currentStoreId
  );
  const storeUrl = selectedStore?.store_url;

  // Fetch statistics when the store changes
  useEffect(() => {
    if (!storeUrl) return;

    // Example: Fetch daily snapshots
    getSnapshots(storeUrl, "daily")
      .then((data) => setSnapshots(data))
      .catch(() => {});

    // Example: Fetch real-time weekly statistics
    getRealtimeStatistics(storeUrl, "weekly")
      .then((data) => setRealtimeStats(data))
      .catch(() => {});
  }, [storeUrl, getSnapshots, getRealtimeStatistics]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex gap-4 max-w-full">
        {/* Left column with 3 stacked rectangles */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Top rectangle */}
          <div className=" rounded-lg  ">
            <StatisticsCards />
          </div>
          
          {/* Middle rectangle */}
          <div className="rounded-lg  ">
            <SpendingStatisticsWithAPI />
          </div>
          
          {/* Bottom rectangle */}
          <div className=" rounded-lg  ">
            <OrderDetails />
          </div>
        </div>
        
        {/* Right column with 2 stacked rectangles */}
        <div className="flex flex-col gap-4 w-80">
          {/* Top rectangle */}
          <div className=" rounded-lg  ">
            <BalanceCard />
          </div>
          
          {/* Bottom rectangle */}
          <div className=" rounded-lg  ">
            <SpendingDonut />
          </div>
        </div>
      </div>
    </div>
  );
}