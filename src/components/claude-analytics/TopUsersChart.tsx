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

interface TopUsersChartProps {
  users: ClaudeAnalyticsUser[];
  metric: "total_tokens" | "total_sessions";
  title: string;
  color?: string;
}

export default function TopUsersChart({
  users,
  metric,
  title,
  color = "#8dd5d6",
}: TopUsersChartProps) {
  const data = [...users]
    .sort((a, b) => b[metric] - a[metric])
    .map((u) => ({
      name: u.user_name,
      value: u[metric],
      formatted:
        metric === "total_tokens"
          ? formatTokens(u[metric])
          : u[metric].toLocaleString(),
    }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-tertiary mb-4">
        Ranked by {metric === "total_tokens" ? "token consumption" : "session count"}
      </p>
      <div style={{ height: Math.max(180, data.length * 48) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(141,213,214,0.08)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
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
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              width={120}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid rgba(141,213,214,0.15)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                fontSize: "13px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              cursor={{ fill: "rgba(141,213,214,0.05)" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: any) => [
                metric === "total_tokens"
                  ? formatTokens(Number(value))
                  : Number(value).toLocaleString(),
                metric === "total_tokens" ? "Tokens" : "Sessions",
              ]) as any}
            />
            <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} barSize={28}>
              <LabelList
                dataKey="formatted"
                position="right"
                style={{
                  fill: "var(--text-secondary)",
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
