"use client";
import * as React from "react";
import { Input as UIInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  variant?: "default" | "primary" | "secondary" | "error" | "success";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      error,
      label,
      variant = "default",
      size = "md",
      radius = "full",
      style,
      ...props
    },
    ref
  ) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center font-algecom",
          // Custom variants (use Tailwind CSS variable colors like in Button)
          variant === "primary" && "border-[var(--primary-900)] focus-within:border-[var(--primary-700)]",
          variant === "secondary" && "border-[var(--secondary-900)] focus-within:border-[var(--secondary-700)]",
          variant === "error" && "border-[var(--error-900)] focus-within:border-[var(--error-700)]",
          variant === "success" && "border-[var(--success-900)] focus-within:border-[var(--success-700)]",
          variant === "default" && "border-[var(--neutral-300)] focus-within:border-[var(--primary-900)]",
          // Size
          size === "sm" && "h-8 text-xs",
          size === "md" && "h-10 text-sm",
          size === "lg" && "h-12 text-base px-4",
          // Radius
          radius === "none" && "rounded-none",
          radius === "sm" && "rounded-sm",
          radius === "md" && "rounded-md",
          radius === "lg" && "rounded-lg",
          radius === "xl" && "rounded-xl",
          radius === "full" && "rounded-full",
          "border px-3 py-2 transition-colors w-full bg-white",
          className
        )}
        style={style}
      >
        {leftIcon && (
          <>
            <span className="flex items-center pr-2 h-full text-primary-900">{leftIcon}</span>
            <span className="h-6 w-px bg-neutral-300 mx-2" />
          </>
        )}
        <UIInput
          ref={ref}
          className={cn(
            "flex-1 h-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:outline-none focus:bg-white placeholder:text-neutral-400",
            leftIcon && "pl-0",
            rightIcon && "pr-10"
          )}
          style={{ 
            boxShadow: "none",
            outline: "none",
            padding: "0"
          }}
          {...props}
        />
        {rightIcon && (
          <>
            <span className="h-6 w-px bg-neutral-300 mx-2 absolute right-9 top-1/2 -translate-y-1/2" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </span>
          </>
        )}
      </div>
      {error && <p className="text-sm text-error-900">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";



interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  iconFirst?: React.ReactNode;
  iconLast?: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

const SimpleInput = React.forwardRef<HTMLInputElement, SimpleInputProps>(
  (
    { className = "", iconFirst, iconLast, width, height, style, ...props },
    ref
  ) => (
    <div
      className={cn(
        "flex items-center border border-gray-300 rounded-md bg-white px-3 py-2",
        className
      )}
      style={{ width, height, ...style }}
    >
      {iconFirst && (
        <span className="flex items-center mr-2">{iconFirst}</span>
      )}
      <UIInput
        ref={ref}
        className={cn(
          "flex-1 h-full bg-transparent border-0",
          "focus:outline-none focus-visible:outline-none",
          "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder:text-neutral-400",
          className
        )}
        style={{ 
          boxShadow: "none",
          outline: "none",
          padding: "0 8px", // زيادة padding لإبعاد cursor عن الأيقونة
          fontSize: "inherit",
          ...style
        }}
        {...props}
      />
      {iconLast && <span className="ml-2">{iconLast}</span>}
    </div>
  )
);

SimpleInput.displayName = "SimpleInput";

export default SimpleInput;