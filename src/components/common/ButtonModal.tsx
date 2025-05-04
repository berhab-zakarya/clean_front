// This extends the shadcn Button with your custom variants
import { Button as ShadcnButton } from "@/components/ui/button";
import { type ButtonProps as ShadcnButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define the button variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary-900)] text-white hover:bg-[var(--primary-700)]",
        "primary-outline": "border border-[var(--primary-900)] text-[var(--primary-900)] bg-transparent hover:bg-[var(--primary-100)]",
        "primary-ghost": "text-[var(--primary-900)] hover:bg-[var(--primary-100)]",

        secondary: "bg-[var(--secondary-900)] text-white hover:bg-[var(--secondary-700)]",
        "secondary-outline": "border border-[var(--secondary-900)] text-[var(--secondary-900)] bg-transparent hover:bg-[var(--secondary-100)]",
        "secondary-ghost": "text-[var(--secondary-900)] hover:bg-[var(--secondary-100)]",

        success: "bg-[var(--success-900)] text-white hover:bg-[var(--success-700)]",
        "success-outline": "border border-[var(--success-900)] text-[var(--success-900)] bg-transparent hover:bg-[var(--success-100)]",
        "success-ghost": "text-[var(--success-900)] hover:bg-[var(--success-100)]",

        error: "bg-[var(--error-900)] text-white hover:bg-[var(--error-700)]",
        "error-outline": "border border-[var(--error-900)] text-[var(--error-900)] bg-transparent hover:bg-[var(--error-100)]",
        "error-ghost": "text-[var(--error-900)] hover:bg-[var(--error-100)]",

        gray: "bg-gray-400 text-[var(--neutral-900)] hover:bg-[var(--neutral-400)]",
        "gray-outline": "border border-[var(--neutral-300)] text-[var(--neutral-900)] bg-transparent hover:bg-[var(--neutral-100)]",
        "gray-ghost": "text-[var(--neutral-900)] hover:bg-[var(--neutral-100)]",

        white: "bg-white text-[var(--neutral-900)] hover:bg-[var(--neutral-100)]",
        "white-outline": "border border-white text-[var(--neutral-900)] bg-transparent hover:bg-[var(--neutral-100)]",
        "white-ghost": "text-[var(--neutral-900)] hover:bg-[var(--neutral-100)]",

        default: "",
        destructive: "",
        outline: "",
        ghost: "",
        link: "",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 py-2 text-sm rounded-md",
        lg: "h-12 px-6 py-2 text-base rounded-lg",
        xl: "h-14 px-8 py-3 text-lg rounded-lg",
        "2xl": "h-16 px-10 py-3 text-xl rounded-xl",
      },
      withIcon: {
        true: "gap-2",
      },
      isFullWidth: {
        true: "w-full",
      },
      isRounded: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      withIcon: false,
      isFullWidth: false,
      isRounded: false,
    },
  }
);

// Define the props for our custom button
export interface ButtonProps 
  extends Omit<ShadcnButtonProps, "className" | "asChild" | "size">, 
    VariantProps<typeof buttonVariants> {
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    withIcon,
    isFullWidth,
    isRounded,
    leftIcon, 
    rightIcon,
    loading,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    // Create buttonProps object without custom props
    const buttonProps = {
      className: cn(
        buttonVariants({ 
          variant, 
          size, 
          withIcon: !!(leftIcon || rightIcon), 
          isFullWidth,
          isRounded,
          className 
        })
      ),
      disabled: isDisabled,
      ref,
      ...props
    };

    // Filter out our custom props from reaching DOM
    const {
      leftIcon: _leftIcon,
      rightIcon: _rightIcon,
      loading: _loading,
      isFullWidth: _isFullWidth,
      isRounded: _isRounded,
      ...domProps
    } = props;

    return (
      <ShadcnButton 
        {...buttonProps}
        {...domProps}
      >
        {loading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };