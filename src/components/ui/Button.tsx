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
      "inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-accent text-background hover:bg-accent-hover shadow-[0_0_20px_rgba(141,213,214,0.15)] hover:shadow-[0_0_25px_rgba(141,213,214,0.25)]":
          variant === "primary",
        "bg-surface-2 text-text-primary border border-accent/10 hover:border-accent/25 hover:bg-surface-3":
          variant === "secondary",
        "border border-accent/20 bg-transparent text-accent hover:bg-accent/10 hover:border-accent/40":
          variant === "outline",
        "text-text-secondary hover:text-text-primary hover:bg-surface-2":
          variant === "ghost",
        "h-9 px-4 text-sm": size === "sm",
        "h-11 px-6 text-base": size === "md",
        "h-14 px-8 text-lg": size === "lg",
      },
      className
    );

    if (asChild && children) {
      const child = children as React.ReactElement;
      const childProps = child.props as Record<string, unknown>;
      return (
        <child.type
          {...childProps}
          className={cn(classes, childProps.className as string | undefined)}
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
