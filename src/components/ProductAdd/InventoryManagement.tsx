import React, { useState } from "react";
import { Checkbox } from "../common/Checkbox";
import SimpleInput from "../common/Input";

interface InventoryManagementProps {
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  initialQuantity = 0,
  onQuantityChange,
}) => {
  const [trackQuantity, setTrackQuantity] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [allowOutOfStockPurchases, setAllowOutOfStockPurchases] =
    useState<boolean>(false);
 
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
      onQuantityChange?.(value);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const decrementQuantity = () => {
    const newQuantity = quantity > 0 ? quantity - 1 : 0;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
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
                  className="rounded-[4px] h-[20px] w-[20px]"
                  checked={trackQuantity}
                  onCheckedChange={() => setTrackQuantity(!trackQuantity)}
                  color="secondary"
                />
              </div>
              <span className="text-[16px] font-[400]">Track quantity</span>
            </label>

            {trackQuantity && (
              <div className="w-full mt-4">
                <div className="space-y-2">
                  <label htmlFor="quantityInput" className="text-[20px] font-[500] ">
                    Quantity
                  </label>
                  <SimpleInput
                    id="quantityInput"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={quantity}
                    onChange={handleQuantityChange}
                    width={200}
                    height={39}
                    className="text-left text-[16px] font-[400]"
                  />
                </div>
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
              This won&apos;t affect POS. Staff will see a warning, but
              can complete when available inventory reaches zero and below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;