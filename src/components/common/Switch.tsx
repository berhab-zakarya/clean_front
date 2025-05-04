"use client";
import * as React from "react";
import { Switch as UISwitch } from "@/components/ui/switch";
import type { SwitchProps as UISwitchProps } from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends UISwitchProps {
  label?: string;
  color?: "primary" | "neutral";
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, label, color = "primary", ...props }, ref) => (
    <div className="inline-flex items-center gap-2 font-algecom">
      <UISwitch
        ref={ref}
        className={cn(
          // تخصيص الألوان حسب المطلوب
          color === "primary" && "data-[state=checked]:bg-primary-900",
          color === "neutral" && "data-[state=checked]:bg-neutral-400",
          className
        )}
        {...props}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
);
Switch.displayName = "Switch";