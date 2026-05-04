"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { type DailyDataPoint } from "@/lib/claude-analytics/aggregate";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { CHART_TOOLTIP_STYLE, CHART_GRID_PROPS, CHART_AXIS_TICK } from "./chartConfig";

interface UsageTimelineProps {
  data: DailyDataPoint[];
  unknown?: { sessions: number; tokens: number; messages: number };
}

type MetricKey = "tokens" | "sessions" | "messages";

const METRICS: { key: MetricKey; label: string; color: string; gradientId: string }[] = [
  { key: "tokens", label: "Tokens", color: "#8dd5d6", gradientId: "gradTokens" },
  { key: "sessions", label: "Sessions", color: "#d6b88d", gradientId: "gradSessions" },
  { key: "messages", label: "Messages", color: "#8b5cf6", gradientId: "gradMessages" },
];

export default function UsageTimeline({ data, unknown }: UsageTimelineProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("tokens");
  const metric = METRICS.find((m) => m.key === activeMetric)!;
  const unknownForMetric = unknown ? unknown[activeMetric] : 0;

  const formatXAxis = (date: string) => {
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatYAxis = (value: number) => {
    if (activeMetric === "tokens") return formatTokens(value);
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return String(value);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Usage Timeline
          </h3>
          <p className="text-sm text-text-tertiary">
            Daily {metric.label.toLowerCase()} usage over time
            {unknownForMetric > 0 && (
              <>
                {" "}
                <span className="text-accent-warm">
                  (+
                  {activeMetric === "tokens"
                    ? formatTokens(unknownForMetric)
                    : unknownForMetric.toLocaleString()}{" "}
                  with unknown date)
                </span>
              </>
            )}
          </p>
        </div>
        {/* Metric toggle pills */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-2 p-1 shrink-0">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeMetric === m.key
                  ? "bg-surface-3 text-text-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              {METRICS.map((m) => (
                <linearGradient
                  key={m.gradientId}
                  id={m.gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={m.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...CHART_GRID_PROPS} vertical={false} />
            <XAxis
              dataKey="date"
              tick={CHART_AXIS_TICK.small}
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tick={CHART_AXIS_TICK.secondary}
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              {...CHART_TOOLTIP_STYLE}
              labelFormatter={(label) => {
                const d = new Date(label + "T00:00:00");
                return d.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
              /* eslint-disable @typescript-eslint/no-explicit-any */
              formatter={((value: any) => [
                activeMetric === "tokens"
                  ? formatTokens(Number(value))
                  : Number(value).toLocaleString(),
                metric.label,
              ]) as any}
              /* eslint-enable @typescript-eslint/no-explicit-any */
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={metric.color}
              strokeWidth={2}
              fill={`url(#${metric.gradientId})`}
              animationDuration={1000}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 4,
                fill: metric.color,
                stroke: "var(--surface-1)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
