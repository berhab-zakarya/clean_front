import * as React from "react";
import { Alert as UIAlert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  title?: string;
  icon?: React.ReactNode;
}

const colorVariants = {
  primary: "bg-primary-100 border-primary-900 text-primary-900",
  secondary: "bg-secondary-100 border-secondary-900 text-secondary-900",
  success: "bg-success-100 border-success-900 text-success-900",
  error: "bg-error-100 border-error-900 text-error-900",
  warning: "bg-warning-100 border-warning-900 text-warning-900",
  info: "bg-info-100 border-info-900 text-info-900",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, color = "primary", title, icon, children, ...props }, ref) => (
    <UIAlert
      ref={ref}
      className={cn(
        "border-l-4 p-4 rounded-md flex items-start gap-3 font-algecom",
        colorVariants[color],
        className
      )}
      {...props}
    >
      {icon && <span className="mt-1">{icon}</span>}
      <div>
        {title && <div className="font-bold mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </UIAlert>
  )
);
Alert.displayName = "Alert";