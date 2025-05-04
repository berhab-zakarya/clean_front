import { ChevronDown } from "lucide-react";
import { Checkbox } from "../common/Checkbox";
import SimpleInput from "../common/Input";

import { MoreHorizontal, Info } from "lucide-react";

interface ProductSidebarProps {
  productData: {
    status: string;
    channels: {
      onlineStore: boolean;
      shop: boolean;
      pointOfSale: boolean;
    };
    markets: {
      international: boolean;
      us: boolean;
    };
    category: string;
    productType: string;
    vendor: string;
  };
  handleInputChange: (e: any) => void;
  handleChannelChange: (channel: string) => void;
  handleMarketChange: (market: string) => void;
}

export default function ProductSidebar({
  productData,
  handleInputChange,
  handleChannelChange,
  handleMarketChange,
}: ProductSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-[20px] font-[600] text-black mb-4">Status</h2>
        <div className="relative">
          <select
            id="status"
            name="status"
            value={productData.status}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-3.5 text-gray-500"
            size={16}
          />
        </div>
      </div>

      {/* Sales Channels */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-[600] text-black ">Publishing</h2>
          <button className="text-gray-500">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Sales Channels */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Sales channels
          </h3>
          <div className="flex flex-col space-y-4">
            {" "}
            {/* Changed to flex-col and increased spacing */}
            <Checkbox
              id="onlineStore"
              checked={productData.channels.onlineStore}
              onCheckedChange={() => handleChannelChange("onlineStore")}
              color="secondary"
              className="rounded-[2px] h-[20px] w-[20px]"
              labelClassName="text-[16px] text-gray-700"
              label="Online Store"
            />
            <Checkbox
              id="shop"
              checked={productData.channels.shop}
              onCheckedChange={() => handleChannelChange("shop")}
              color="secondary"
              className="rounded-[2px] h-[20px] w-[20px]"
              labelClassName="text-[16px] text-gray-700"
              label="Shop"
            />
            <Checkbox
              id="pointOfSale"
              checked={productData.channels.pointOfSale}
              onCheckedChange={() => handleChannelChange("pointOfSale")}
              color="secondary"
              className="rounded-[2px] h-[20px] w-[20px]"
              labelClassName="text-[16px] text-gray-700"
              label="Point of Sale"
            />
            {!productData.channels.pointOfSale && (
              <div className="ml-7 text-sm text-[var(--primary-900)]">
                <p className="text-[var(--primary-900)]">
                  Point of Sale has not been set up. Finish the
                  <br />
                  remaining steps to start selling in person.
                </p>
                <a
                  href="#"
                  className="text-[var(--primary-900)] font-medium mt-1 block"
                >
                  Learn more
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Markets */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Markets</h3>
          <div className="space-y-2">
            <Checkbox
              id="international"
              checked={
                productData.markets.international && productData.markets.us
              }
              onCheckedChange={() => {
                handleMarketChange("international");
                handleMarketChange("us");
              }}
              color="secondary"
              className="rounded h-5 w-5"
              labelClassName="text-base text-gray-700"
              label="International and United States"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Product organization
          </h2>
          <Info className="ml-1 text-black" size={18} />
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="category"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Category
            </label>
            <SimpleInput
              type="text"
              id="category"
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
            <p className="font-[500] text-[16px] text-[var(--primary-900)] mt-1">
              Determines US tax rates
            </p>
          </div>

          <div>
            <label
              htmlFor="productType"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Product type
            </label>
            <SimpleInput
              type="text"
              id="productType"
              name="productType"
              value={productData.productType}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="vendor"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Vendor
            </label>
            <SimpleInput
              type="text"
              id="vendor"
              name="vendor"
              value={productData.vendor}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="collections"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Collections
            </label>
            <SimpleInput
              type="text"
              id="collections"
              name="collections"
              value={productData.collections}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Tags
            </label>
            <SimpleInput
              type="text"
              id="tags"
              name="tags"
              value={productData.tags}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
