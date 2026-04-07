"use client";

import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card hover className="group">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="rounded-xl bg-accent/10 p-3 transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(141,213,214,0.1)]">
            <Icon className="h-5 w-5 text-accent" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-text-tertiary">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-text-primary mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
