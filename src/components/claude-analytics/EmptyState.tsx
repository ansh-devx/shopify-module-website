"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-2xl bg-surface-2 p-4 mb-4">
        <Icon className="h-6 w-6 text-text-tertiary" />
      </div>
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      {description && (
        <p className="text-xs text-text-tertiary mt-1 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
