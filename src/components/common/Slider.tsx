"use client";
import * as React from "react";
import { Slider as UISlider } from "@/components/ui/slider";
import type { SliderProps as UISliderProps } from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface CustomSliderProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  showTooltip?: boolean;
  className?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, CustomSliderProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100,
      showTooltip = true,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value ?? [min]);
    const handleChange = (values: number[]) => {
      setInternalValue(values);
      onChange?.(values);
    };

    const percent = ((value?.[0] ?? internalValue[0]) - min) / (max - min);

    return (
      <div className="flex items-center gap-2 w-full relative">
        <span className="text-neutral-400 text-sm">{min}</span>
        <div className="relative flex-1">
          <UISlider
            min={min}
            max={max}
            value={value ?? internalValue}
            onValueChange={handleChange}
            className={cn(
              "w-full h-2 rounded-lg appearance-none bg-neutral-200 outline-none slider-thumb", // أزل pointer-events-none
              className
            )}
            style={{
              accentColor: "#1D317B",
            }}
            ref={ref}
            {...props}
          />
          {showTooltip && (
            <div
              className="absolute -top-14 flex flex-col items-center"
              style={{
                left: `calc(${percent * 100}% - 20px)`,
                width: "40px",
              }}
            >
              <div className="bg-neutral-800 text-white text-center rounded py-1 px-2 font-algecom text-sm">
                {value ?? internalValue}
              </div>
              <div className="w-3 h-3 bg-neutral-800 rotate-45 -mt-1" />
            </div>
          )}
        </div>
        <span className="text-neutral-400 text-sm">{max}</span>
      </div>
    );
  }
);

Slider.displayName = "CustomSlider";
