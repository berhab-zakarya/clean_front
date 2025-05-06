import { useState, useEffect } from "react";
import Image from "next/image";
import SimpleInput, { Input } from "../common/Input";
import { Checkbox } from "../common/Checkbox";

export default function PricingComponent() {
  const [productData, setProductData] = useState({
    price: "",
    comparePrice: "",
    cost: "",
    chargeTax: true,
  });

  const [profit, setProfit] = useState("--");
  const [margin, setMargin] = useState("--");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    // Calculate profit and margin when price or cost changes
    if (productData.price && productData.cost) {
      const priceValue = parseFloat(productData.price);
      const costValue = parseFloat(productData.cost);
      if (!isNaN(priceValue) && !isNaN(costValue)) {
        const calculatedProfit = priceValue - costValue;
        setProfit(calculatedProfit.toFixed(2));

        const calculatedMargin = (calculatedProfit / priceValue) * 100;
        setMargin(calculatedMargin.toFixed(1));
      }
    } else {
      setProfit("--");
      setMargin("--");
    }
  }, [productData.price, productData.cost]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="font-[500] text-[20px] text-gray-800 mb-2">Pricing</h2>

      <div className="space-y-6">
        <div className="flex">
          <div className="mr-[29px]">
            <label
              htmlFor="price"
              className="block text-[16px] font-[400] font-normal text-gray-700 mb-2"
            >
              Price
            </label>
            <SimpleInput
              type="text"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              width={200}
              height={35}
              iconFirst={
                <span className="text-black font-semibold text-[16px]">$</span>
              }
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="comparePrice"
              className="block text-[16px] font-normal font-[400] text-gray-700 mb-2"
            >
              Compare-price
            </label>
            <SimpleInput
              type="text"
              id="comparePrice"
              name="comparePrice"
              value={productData.comparePrice}
              onChange={handleInputChange}
              placeholder="0.00"
              width={200}
              height={35}
              iconFirst={
                <span className="text-black font-semibold text-[16px]">$</span>
              }
              iconLast={
                <Image
                  src="/assets/icons/icon_help_hexagon.svg"
                  alt="Help Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              }
              className="text-[16px] pr-2"
            />
          </div>
        </div>

        <div className="py-2">
          <div className="flex items-center">
            <Checkbox
              id="chargeTax"
              name="chargeTax"
              checked={productData.chargeTax}
              onCheckedChange={(checked) =>
                handleInputChange({
                  target: {
                    name: "chargeTax",
                    type: "checkbox",
                    checked,
                  },
                })
              }
              color="secondary"
              
              className="rounded-[4px]  h-[20px] w-[20px]"
              
            />
            <label
              htmlFor="chargeTax"
              className="ml-2 text-sm text-black text-[16px] font-[400] "
            >
              Charge tax on this product
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="cost"
              className="block text-[16px] font-normal text-gray-700 mb-2"
            >
              Cost per items
            </label>
            <div className="relative flex items-center">
              <SimpleInput
                type="text"
                id="cost"
                name="cost"
                value={productData.cost}
                onChange={handleInputChange}
                placeholder="0.00"
                width={200}
                height={45}
                iconFirst={
                  <span className="text-black font-semibold text-[20px]">
                    $
                  </span>
                }
                iconLast={
                  <Image
                    src="/assets/icons/icon_help_hexagon.svg"
                    alt="Help Icon"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                }
                className="text-[20px] text-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-[16px] font-[400] font-normal text-gray-700 mb-2">
              Profit
            </label>
            <div
              className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md"
              style={{ width: "200px", height: "45px" }}
            >
              ${profit}
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-[400] font-normal text-gray-700 mb-2">
              Margin
            </label>
            <div
              className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md"
              style={{ width: "200px", height: "45px" }}
            >
              {margin}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}