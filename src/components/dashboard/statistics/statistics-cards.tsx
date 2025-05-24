import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Total Income Card */}
      <Card className="w-full rounded-r-none">
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <CardTitle className="text-[#1e3a8a] text-[16px]  font-[500]">
            Total Income
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
                <span className="text-[#1e3a8a] text-[32px] font-[600]">50,530.00</span>
                <span className="text-[#828282] text-[14px] font-[400]  ml-2">(DZD)</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[14px] mt-2">
                <span className="text-green-500 font-[400]">20%</span>
                <span className="text-muted-foreground">
                  {" "}
                  increase compared to last week
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expense Card */}
      <Card className="w-full rounded-l-none">
        <CardHeader className="flex flex-row items-start justify-between pb-0">
          <CardTitle className="text-[#1e3a8a] text-[16px]  font-[500]">
            Total Expense
          </CardTitle>
          <div className="bg-[#f3f4f6] rounded-md p-2">
            <Image
              src={"/assets/icons/down_icon.svg"}
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
                  19,760.00
                </span>
                <span className="text-[#828282] text-[14px] font-[400] ml-2">(DZD)</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[14px] mt-2">
                <span className="text-red-500 font-[400]">10%</span>
                <span className="text-muted-foreground">
                  {" "}
                  decrease compared to last week
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}