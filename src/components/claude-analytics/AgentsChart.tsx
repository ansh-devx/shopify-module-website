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

interface AgentsChartProps {
  agents: Record<string, number>;
  title?: string;
}

export default function AgentsChart({
  agents,
  title = "Agents Distribution",
}: AgentsChartProps) {
  const data = Object.entries(agents)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Estimate YAxis width from longest label (~7.2px per char at 12px font)
  const maxLabelLen = data.reduce((max, d) => Math.max(max, d.name.length), 0);
  const yAxisWidth = Math.max(100, Math.min(280, maxLabelLen * 7.2 + 16));

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {title}
        </h3>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-text-tertiary">No agent data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-tertiary mb-4">
        {data.length} agent type{data.length !== 1 ? "s" : ""} &middot;{" "}
        {data.reduce((s, d) => s + d.count, 0).toLocaleString()} total
        invocations
      </p>
      <div style={{ height: Math.max(200, data.length * 44) }}>
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
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              width={yAxisWidth}
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
              formatter={((value: any) => [Number(value).toLocaleString(), "Invocations"]) as any}
            />
            <Bar
              dataKey="count"
              fill="#d6b88d"
              radius={[0, 6, 6, 0]}
              barSize={28}
            >
              <LabelList
                dataKey="count"
                position="right"
                style={{
                  fill: "var(--text-secondary)",
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => Number(v).toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
