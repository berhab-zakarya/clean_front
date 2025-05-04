"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label?: React.ReactNode
  }
>(({ className, label, children, ...props }, ref) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "peer h-5 w-5 rounded-full border border-neutral-300 text-[#1E3A8A]",
          "focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-[#1E3A8A] data-[state=checked]:text-[#1E3A8A]",
          "hover:border-[#1E3A8A]",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-3 w-3 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <div className="cursor-pointer select-none">{label}</div>
      )}
    </label>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }