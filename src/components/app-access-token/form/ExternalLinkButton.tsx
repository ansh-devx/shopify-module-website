"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExternalLinkButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function ExternalLinkButton({
  href,
  children,
  icon,
  className,
}: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg",
        "bg-accent text-white font-medium",
        "hover:bg-accent/90 transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
    >
      {icon}
      {children}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

