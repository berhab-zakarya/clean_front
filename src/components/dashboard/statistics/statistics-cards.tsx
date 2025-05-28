import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useStatistics } from "@/hooks/useStatistics";
import { useStorePath } from "@/hooks/useStorePath";
import { useStore } from "@/hooks/useStore";

export function StatisticsCards() {
  const { getSnapshots } = useStatistics();
  const { currentStoreId } = useStorePath();
  const { stores } = useStore();
  const [monthlyStats, setMonthlyStats] = useState<{ average: number; total: number }>({ average: 0, total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const selectedStore = stores?.find(
        (store) => store.id.toString() === currentStoreId
      );
      const storeUrl = selectedStore?.store_url;

      if (!storeUrl) return;

      try {
        const snapshots = await getSnapshots(storeUrl, "monthly");
        if (snapshots && snapshots.length > 0) {
          // Get the most recent monthly snapshot
          const latestSnapshot = snapshots[0];
          const total = parseFloat(latestSnapshot.total_sales_amount);
          const average = parseFloat(latestSnapshot.average_order_value);
          setMonthlyStats({ average, total });
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStats();
  }, [currentStoreId, stores, getSnapshots]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Average Monthly Card */}
      <Card className="w-full rounded-r-none">
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <CardTitle className="text-[#1e3a8a] text-[16px] font-[500]">
            Average Monthly
          </CardTitle>
          <div className="bg-[#f3f4f6] rounded-md p-2">
            <Image
              src={"/assets/icons/up_icon.svg"}
              alt="up icon"
              width={34}
              height={34}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white h-full">
            <div>
              <div className="flex items-baseline mb-2">
                <span className="text-[#1e3a8a] text-[32px] font-[600]">
                  {monthlyStats.average.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[#828282] text-[14px] font-[400] ml-2">(DZD)</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[14px] mt-2">
                <span className="text-green-500 font-[400]">Monthly Average</span>
                <span className="text-muted-foreground">
                  {" "}
                  based on historical data
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Spending Card */}
      <Card className="w-full rounded-l-none">
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <CardTitle className="text-[#1e3a8a] text-[16px] font-[500]">
            Total Spending
          </CardTitle>
          <div className="bg-[#f3f4f6] rounded-md p-2">
            <Image
              src={"/assets/icons/down_icon.svg"}
              alt="down icon"
              width={34}
              height={34}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white h-full">
            <div>
              <div className="flex items-baseline mb-2">
                <span className="text-[#1e3a8a] text-[32px] font-[600]">
                  {monthlyStats.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[#828282] text-[14px] font-[400] ml-2">(DZD)</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[14px] mt-2">
                <span className="text-red-500 font-[400]">Total</span>
                <span className="text-muted-foreground">
                  {" "}
                  accumulated spending
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}