"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { Cpu } from "lucide-react";
import EmptyState from "./EmptyState";
import { CHART_TOOLTIP_STYLE } from "./chartConfig";

const MODEL_COLORS: Record<string, string> = {
  "claude-opus-4-6": "#f97316",
  "claude-sonnet-4-6": "#3b82f6",
  "claude-haiku-4-5": "#10b981",
};

const DEFAULT_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

interface ModelsPieChartProps {
  models: Record<string, number>;
  title?: string;
}

export default function ModelsPieChart({
  models,
  title = "Model Distribution",
}: ModelsPieChartProps) {
  const total = Object.values(models).reduce((sum, v) => sum + v, 0);
  const data = Object.entries(models)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const getColor = (name: string, index: number) =>
    MODEL_COLORS[name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

  if (total === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {title}
        </h3>
        <EmptyState
          icon={Cpu}
          title="No model data"
          description="No model usage has been recorded yet."
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {title}
        </h3>
        <p className="text-sm text-text-tertiary mb-4">
          {total} total sessions across {data.length} model
          {data.length !== 1 ? "s" : ""}
        </p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                label={false}
                stroke="var(--surface-1)"
                strokeWidth={2}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={getColor(entry.name, index)} />
                ))}
              </Pie>
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                /* eslint-disable @typescript-eslint/no-explicit-any */
                formatter={((value: any) => [
                  `${value} sessions (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
                  "Sessions",
                ]) as any}
                /* eslint-enable @typescript-eslint/no-explicit-any */
              />
              {/* Center label */}
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-primary)"
                fontSize={22}
                fontWeight={600}
                fontFamily="var(--font-sans)"
              >
                {total}
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-tertiary)"
                fontSize={11}
                fontFamily="var(--font-sans)"
              >
                sessions
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Model Usage List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Model Usage
        </h3>
        <p className="text-sm text-text-tertiary mb-4">
          Session breakdown by model
        </p>
        <div className="space-y-2">
          {data.map((entry, index) => {
            const percent =
              total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
            const color = getColor(entry.name, index);
            return (
              <div
                key={entry.name}
                className="group rounded-lg px-3 py-3 hover:bg-surface-2 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-text-primary">
                      {entry.name.replace("claude-", "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-secondary tabular-nums">
                      {entry.value.toLocaleString()} sessions
                    </span>
                    <span className="text-xs text-text-tertiary tabular-nums w-12 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
                {/* Proportion bar */}
                <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
