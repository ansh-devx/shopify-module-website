import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          {
            "bg-gray-100 text-gray-800": variant === "default",
            "bg-shopify-green/10 text-shopify-green": variant === "success",
            "bg-shopify-yellow/10 text-shopify-yellow": variant === "warning",
            "bg-shopify-red/10 text-shopify-red": variant === "error",
            "bg-shopify-blue/10 text-shopify-blue": variant === "info",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
