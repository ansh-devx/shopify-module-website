"use client";

import {
  useRef,
  useState,
  ReactNode,
  MouseEvent as ReactMouseEvent,
} from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface RippleType {
  id: number;
  x: number;
  y: number;
}

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "small";
  as?: "button" | "a";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  variant = "primary",
  as = "button",
  href,
  className,
  onClick,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<RippleType[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * 0.25);
    y.set(offsetY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: ReactMouseEvent) => {
    if (disabled) return;
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x: rippleX, y: rippleY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);

    onClick?.();
  };

  const variantClasses = {
    primary:
      "bg-accent text-gray-50 px-8 py-4 text-lg font-medium shadow-[0_0_20px_rgba(141,213,214,0.2)] hover:shadow-[0_0_30px_rgba(141,213,214,0.3)]",
    secondary:
      "border border-accent/20 text-text-primary px-8 py-4 text-lg font-medium hover:border-accent/40 hover:text-accent",
    small:
      "bg-accent/10 text-accent px-5 py-2.5 text-sm font-medium hover:bg-accent/20",
  };

  const Component = motion[as] as typeof motion.button;

  const motionProps = {
    ref: ref as React.RefObject<HTMLButtonElement>,
    className: cn(
      "relative overflow-hidden rounded-full cursor-pointer transition-all duration-300 inline-flex items-center justify-center",
      variantClasses[variant],
      disabled && "opacity-50 cursor-not-allowed",
      className,
    ),
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    whileHover: disabled ? undefined : { scale: 1.03 },
    whileTap: disabled ? undefined : { scale: 0.95 },
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      mass: 0.1,
    },
    ...(as === "a" ? { href } : { type }),
    ...(disabled ? { disabled } : {}),
  };

  return (
    <Component {...motionProps}>
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-accent/20 pointer-events-none"
          style={{ left: ripple.x - 25, top: ripple.y - 25 }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 50, height: 50, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </Component>
  );
}
