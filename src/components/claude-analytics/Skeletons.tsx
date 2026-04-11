"use client";

import { Card } from "@/components/ui/Card";

export function SkeletonCard() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface-3/50 to-transparent" />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-surface-3 animate-pulse" />
          <div className="h-9 w-9 rounded-lg bg-surface-3 animate-pulse" />
        </div>
        <div className="h-8 w-24 rounded bg-surface-3 animate-pulse" />
        <div className="h-3 w-28 rounded bg-surface-3/60 animate-pulse" />
      </div>
    </Card>
  );
}

export function SkeletonChart({ height = 280 }: { height?: number }) {
  return (
    <Card className="p-6">
      <div className="h-5 w-40 rounded bg-surface-3 animate-pulse mb-2" />
      <div className="h-3.5 w-56 rounded bg-surface-3/60 animate-pulse mb-6" />
      <div
        className="rounded-xl bg-surface-3/30 animate-pulse"
        style={{ height }}
      />
    </Card>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-accent/10 flex gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-surface-3 animate-pulse"
            style={{ width: i === 0 ? 80 : 50 }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-5 py-3.5 border-b border-accent/5 flex gap-8"
        >
          <div className="h-4 w-28 rounded bg-surface-3/60 animate-pulse" />
          <div className="h-4 w-14 rounded bg-surface-3/40 animate-pulse" />
          <div className="h-4 w-14 rounded bg-surface-3/40 animate-pulse" />
          <div className="h-4 w-14 rounded bg-surface-3/40 animate-pulse" />
        </div>
      ))}
    </Card>
  );
}

export function SkeletonInsights() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-surface-3 animate-pulse" />
        <div className="h-4 w-32 rounded bg-surface-3 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 rounded bg-surface-3/60 animate-pulse" />
            <div className="h-5 w-24 rounded bg-surface-3 animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  );
}
