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
            "bg-surface-2 text-text-secondary border border-accent/10":
              variant === "default",
            "bg-green-400/10 text-green-400": variant === "success",
            "bg-yellow-400/10 text-yellow-400": variant === "warning",
            "bg-red-400/10 text-red-400": variant === "error",
            "bg-accent/10 text-accent": variant === "info",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
