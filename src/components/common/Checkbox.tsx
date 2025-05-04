"use client";
import * as React from "react";
import { Checkbox as UICheckbox } from "@/components/ui/checkbox";
import { CheckboxProps as UICheckboxProps } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends UICheckboxProps {
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info" | "neutral";
  label?: string;
  labelClassName?: string; // إضافة خاصية جديدة لتخصيص النص
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, color = "primary", label, labelClassName, ...props }, ref) => (
    <div className="inline-flex items-center gap-2 font-algecom">
      <UICheckbox
        ref={ref}
        className={cn(
          "border rounded-md",
          color === "primary" && "data-[state=checked]:bg-[var(--primary-900)] data-[state=checked]:border-[var(--primary-900)]",
          color === "secondary" && "data-[state=checked]:bg-[var(--secondary-900)] data-[state=checked]:border-[var(--secondary-900)]",
          color === "success" && "data-[state=checked]:bg-[var(--success-900)] data-[state=checked]:border-[var(--success-900)]",
          color === "error" && "data-[state=checked]:bg-[var(--error-900)] data-[state=checked]:border-[var(--error-900)]",
          color === "warning" && "data-[state=checked]:bg-[var(--warning-900)] data-[state=checked]:border-[var(--warning-900)]",
          color === "info" && "data-[state=checked]:bg-[var(--info-900)] data-[state=checked]:border-[var(--info-900)]",
          color === "neutral" && "data-[state=checked]:bg-[var(--neutral-400)] data-[state=checked]:border-[var(--neutral-400)]",
          className
        )}
        {...props}
      />
      {label && (
        <span className={cn("text-gray-700", labelClassName)}>
          {label}
        </span>
      )}
    </div>
  )
);

Checkbox.displayName = "Checkbox";