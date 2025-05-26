import { useState } from "react";
import { Checkbox } from "../common/Checkbox";
import SimpleInput from "../common/Input";

interface ShippingComponentProps {
  onWeightChange?: (weight: string) => void;
  onPhysicalProductChange?: (isPhysical: boolean) => void;
}

const ShippingComponent = ({
  onWeightChange,
  onPhysicalProductChange,
}: ShippingComponentProps) => {
  const [isPhysicalProduct, setIsPhysicalProduct] = useState(true);
  const [weight, setWeight] = useState("0");
  const [weightUnit, setWeightUnit] = useState("lb");

  const handlePhysicalProductChange = (checked: boolean) => {
    setIsPhysicalProduct(checked);
    if (onPhysicalProductChange) {
      onPhysicalProductChange(checked);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (onWeightChange) {
      onWeightChange(e.target.value);
    }
  };

 

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Shipping</h2>

        <div className="space-y-6">
          <Checkbox
            id="physicalProduct"
            checked={isPhysicalProduct}
            onCheckedChange={handlePhysicalProductChange}
            color="secondary"
            className="rounded-[2px] h-[20px] w-[20px]"
            labelClassName="text-[16px] text-gray-700 font-medium"
            label="This is a physical product"
          />

          {isPhysicalProduct && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="weight"
                  className="block text-[20px] font-[500] text-black"
                >
                  Weight
                </label>
                <div className="flex">
                  <SimpleInput
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={handleWeightChange}
                    min="0"
                    step="0.1"
                    width={200}
                    height={39}
                    className="text-[16px]"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="rounded-md text-[14px]  h-fit border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-gray-50 transition-colors ml-2"
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>

              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingComponent;