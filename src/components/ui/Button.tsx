import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-shopify-green text-white hover:bg-shopify-green/90 focus-visible:ring-shopify-green":
          variant === "primary",
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500":
          variant === "secondary",
        "border-2 border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500":
          variant === "outline",
        "hover:bg-gray-100 focus-visible:ring-gray-500": variant === "ghost",
        "h-9 px-3 text-sm": size === "sm",
        "h-11 px-6 text-base": size === "md",
        "h-14 px-8 text-lg": size === "lg",
      },
      className
    );

    if (asChild && children) {
      // Clone the child element and merge className
      const child = children as React.ReactElement;
      return (
        <child.type
          {...child.props}
          className={cn(classes, child.props.className)}
          ref={ref}
        />
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
