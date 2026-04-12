"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { ClaudeAnalyticsUser } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import {
  CHART_TOOLTIP_STYLE,
  CHART_GRID_PROPS,
  CHART_AXIS_TICK,
  CHART_LABEL_STYLE,
  BAR_ACTIVE_STYLE,
  BAR_ACTIVE_WARM,
} from "./chartConfig";

interface TopUsersChartProps {
  users: ClaudeAnalyticsUser[];
  metric: "total_tokens" | "total_sessions";
  title: string;
  color?: string;
  onUserClick?: (email: string) => void;
}

export default function TopUsersChart({
  users,
  metric,
  title,
  color = "#8dd5d6",
  onUserClick,
}: TopUsersChartProps) {
  const data = [...users]
    .sort((a, b) => b[metric] - a[metric])
    .map((u) => ({
      name: u.user_name,
      email: u.user_email,
      value: u[metric],
      formatted:
        metric === "total_tokens"
          ? formatTokens(u[metric])
          : u[metric].toLocaleString(),
    }));

  const longestName = data.reduce(
    (max, d) => Math.max(max, d.name.length),
    0
  );
  const yAxisWidth = Math.min(200, Math.max(120, longestName * 7.5));

  const activeStyle =
    color === "#d6b88d" ? BAR_ACTIVE_WARM : BAR_ACTIVE_STYLE;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-tertiary mb-4">
        Ranked by{" "}
        {metric === "total_tokens" ? "token consumption" : "session count"}
      </p>
      <div style={{ height: Math.max(180, data.length * 48) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              {...CHART_GRID_PROPS}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={CHART_AXIS_TICK.secondary}
              tickFormatter={(v) =>
                metric === "total_tokens"
                  ? formatTokens(v)
                  : v.toLocaleString()
              }
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={yAxisWidth}
              axisLine={false}
              tickLine={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              tick={(props: any) => {
                const { x, y, payload } = props;
                const maxChars = Math.floor(yAxisWidth / 7);
                const fullName = payload.value as string;
                const label =
                  fullName.length > maxChars
                    ? fullName.slice(0, maxChars - 1) + "\u2026"
                    : fullName;
                return (
                  <text
                    x={x}
                    y={y}
                    dy={4}
                    textAnchor="end"
                    fill="var(--text-secondary)"
                    fontSize={12}
                  >
                    <title>{fullName}</title>
                    {label}
                  </text>
                );
              }}
            />
            <Tooltip
              {...CHART_TOOLTIP_STYLE}
              /* eslint-disable @typescript-eslint/no-explicit-any */
              formatter={((value: any) => [
                metric === "total_tokens"
                  ? formatTokens(Number(value))
                  : Number(value).toLocaleString(),
                metric === "total_tokens" ? "Tokens" : "Sessions",
              ]) as any}
              /* eslint-enable @typescript-eslint/no-explicit-any */
            />
            <Bar
              dataKey="value"
              fill={color}
              radius={[0, 6, 6, 0]}
              barSize={28}
              activeBar={activeStyle}
              animationDuration={800}
              animationEasing="ease-out"
              style={{ cursor: onUserClick ? "pointer" : undefined }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(_data: any, _index: any, e: any) => {
                const payload = e?.payload ?? _data;
                if (onUserClick && payload?.email) {
                  onUserClick(payload.email);
                }
              }}
            >
              <LabelList
                dataKey="formatted"
                position="right"
                style={CHART_LABEL_STYLE}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
