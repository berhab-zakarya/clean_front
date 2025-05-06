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
  const [showCustoms, setShowCustoms] = useState(false);

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

  const toggleCustoms = () => {
    setShowCustoms(!showCustoms);
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

              <div className="border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={toggleCustoms}
                  className="flex items-center text-[var(--primary-900)] hover:text-blue-800 transition-colors p-2 rounded-md hover:bg-blue-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span className="text-[16px] text-[var(--primary-900)] font-medium">
                    Add customs information
                  </span>
                </button>

                {showCustoms && (
                  <div className="mt-4 p-5 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Customs Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="hsCode"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          HS Code
                        </label>
                        <SimpleInput
                          type="text"
                          id="hsCode"
                          placeholder="Enter HS code"
                          width={200}
                          height={39}
                          className="text-[16px]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="countryOfOrigin"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          Country of Origin
                        </label>
                        <select
                          id="countryOfOrigin"
                          className="block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white transition-colors"
                        >
                          <option value="">Select a country</option>
                          <option value="DZ">Algeria</option>
                          <option value="MA">Morocco</option>
                          <option value="TN">Tunisia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingComponent;