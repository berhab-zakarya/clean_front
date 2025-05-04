import * as React from "react";
import {
  Card as BaseCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CardProps extends React.ComponentProps<typeof BaseCard> {
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  bordered?: boolean;
  bgColor?: string; // Add this line
}

const shadowVariants = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const radiusVariants = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      shadow = "md",
      radius = "xl",
      bordered = true,
      bgColor, // Add this line
      ...props
    },
    ref
  ) => (
    <BaseCard
      ref={ref}
      className={cn(
        bordered ? "border" : "border-0",
        shadowVariants[shadow],
        radiusVariants[radius],
        bgColor, // Add this line
        className
      )}
      {...props}
    >
      {children}
    </BaseCard>
  )
);
Card.displayName = "CustomCard";


export {
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
