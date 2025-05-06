import React, { useState } from "react";
import { Checkbox } from "../common/Checkbox";
import SimpleInput from "../common/Input";

interface InventoryManagementProps {
  initialQuantity?: number;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  initialQuantity = 0,
}) => {
  const [trackQuantity, setTrackQuantity] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [allowOutOfStockPurchases, setAllowOutOfStockPurchases] =
    useState<boolean>(false);
  const [hasSkuOrBarcode, setHasSkuOrBarcode] = useState<boolean>(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-[500] ">Inventory</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex flex-col space-y-1 items-start">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <Checkbox
                  id="trackQuantity"
                  type="checkbox"
                  className="sr-only"
                  checked={trackQuantity}
                  onCheckedChange={() => setTrackQuantity(!trackQuantity)}
                  color="secondary"
                  className="rounded-[4px]  h-[20px] w-[20px]"
                />
              </div>
              <span className="text-[16px] font-[400]">Track quantity</span>
            </label>

            {trackQuantity && (
              <div className="w-full mt-2">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th scope="col" className="text-left pb-2">
                        <span className="text-[20px] font-[500]">Quantity</span>
                      </th>
                    </tr>
                  </thead>
                  {/* Add border line */}
                  <tr>
                    <td colSpan={2}>
                      <div className="border-b border-gray-200 w-full mb-4"></div>
                    </td>
                  </tr>
                  <tbody>
                    <tr>
                      <th scope="row" className="text-left">
                        <div>
                          <div className="truncate">
                            <span className="text-[20px] font-[500]">
                              Shop location
                            </span>
                          </div>
                        </div>
                      </th>
                      <td>
                        <div className="flex justify-end pr-[16px]">
                          <SimpleInput
                            id="quantityInput"
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={quantity}
                            onChange={handleQuantityChange}
                            width={200}
                            height={39}
                            className="text-left text-[20px] font-[600]"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="space-y-4">
            <Checkbox
              id="allowOutOfStockPurchases"
              checked={allowOutOfStockPurchases}
              onCheckedChange={() =>
                setAllowOutOfStockPurchases(!allowOutOfStockPurchases)
              }
              color="secondary"
              labelClassName="text-[16px] text-gray-900 font-[400]"
              className="rounded-[6px] h-[20px] w-[20px]"
              label="Continue selling when out of stock"
            />
            <p className="text-[14px] text-[var(--primary-900)] ml-8">
  This won&apos;t affect Shopify POS. Staff will see a warning, but
  can complete when available inventory reaches zero and below.
</p>
          </div>

          <div className="space-y-4">
            <Checkbox
              id="hasSkuOrBarcode"
              checked={hasSkuOrBarcode}
              onCheckedChange={() => setHasSkuOrBarcode(!hasSkuOrBarcode)}
              color="secondary"
              labelClassName="text-[16px] text-gray-900 font-[400]"
              className="rounded-[6px] h-[20px] w-[20px] text-[20px]"
              label="Continue selling when out of stock"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;