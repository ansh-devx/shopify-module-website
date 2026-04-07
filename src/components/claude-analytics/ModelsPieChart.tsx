"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";

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

  const RADIAN = Math.PI / 180;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } =
      props;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="var(--text-secondary)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontFamily="var(--font-sans)"
      >
        {name.replace("claude-", "")} ({(percent * 100).toFixed(0)}%)
      </text>
    );
  };

  if (total === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {title}
        </h3>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-sm text-text-tertiary">No model data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
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
              label={renderLabel}
              labelLine={false}
              stroke="var(--surface-1)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.name, index)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid rgba(141,213,214,0.15)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                fontSize: "13px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: any) => [
                `${value} sessions (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
                "Sessions",
              ]) as any}
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
  );
}
