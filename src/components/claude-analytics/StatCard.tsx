"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subtext?: string;
  /** Array of recent daily values to render as a mini sparkline bar */
  sparkline?: number[];
}

function useCountUp(target: number, duration = 1200) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px] h-6 mt-1">
      {data.map((v, i) => {
        const heightPercent = Math.max((v / max) * 100, 4); // min 4% so empty bars are visible
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-500"
            style={{
              height: `${heightPercent}%`,
              backgroundColor:
                v === 0
                  ? "rgba(141,213,214,0.06)"
                  : `rgba(141,213,214,${0.2 + (v / max) * 0.5})`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  subtext,
  sparkline,
}: StatCardProps) {
  const numericValue =
    typeof value === "number" ? value : parseFloat(String(value));
  const isNumeric =
    typeof value === "number" ||
    (!isNaN(numericValue) && /^\d+$/.test(String(value)));
  const animated = useCountUp(isNumeric ? numericValue : 0);

  const displayValue = isNumeric ? animated.toLocaleString() : value;

  return (
    <Card hover className="group relative overflow-hidden">
      {/* Subtle gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
            {label}
          </p>
          {Icon && (
            <div className="rounded-lg bg-accent/8 p-2 transition-all duration-300 group-hover:bg-accent/15 group-hover:shadow-[0_0_12px_rgba(141,213,214,0.08)]">
              <Icon className="h-4 w-4 text-accent/70 group-hover:text-accent transition-colors duration-300" />
            </div>
          )}
        </div>
        <p className="text-3xl font-semibold tracking-tight text-text-primary">
          {displayValue}
        </p>
        {subtext && <p className="text-xs text-text-tertiary">{subtext}</p>}
        {sparkline && sparkline.length > 0 && (
          <MiniSparkline data={sparkline} />
        )}
      </div>
    </Card>
  );
}
