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
import { Bot } from "lucide-react";
import EmptyState from "./EmptyState";
import {
  CHART_TOOLTIP_STYLE,
  CHART_GRID_PROPS,
  CHART_AXIS_TICK,
  CHART_LABEL_STYLE,
  BAR_ACTIVE_WARM,
} from "./chartConfig";

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

  const maxLabelLen = data.reduce((max, d) => Math.max(max, d.name.length), 0);
  const yAxisWidth = Math.max(100, Math.min(280, maxLabelLen * 7.2 + 16));

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {title}
        </h3>
        <EmptyState
          icon={Bot}
          title="No agent data"
          description="No agent usage has been recorded yet."
        />
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
              {...CHART_GRID_PROPS}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={CHART_AXIS_TICK.secondary}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={CHART_AXIS_TICK.primary}
              width={yAxisWidth}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...CHART_TOOLTIP_STYLE}
              /* eslint-disable @typescript-eslint/no-explicit-any */
              formatter={((value: any) => [
                Number(value).toLocaleString(),
                "Invocations",
              ]) as any}
              /* eslint-enable @typescript-eslint/no-explicit-any */
            />
            <Bar
              dataKey="count"
              fill="#d6b88d"
              radius={[0, 6, 6, 0]}
              barSize={28}
              activeBar={BAR_ACTIVE_WARM}
              animationDuration={800}
              animationBegin={200}
              animationEasing="ease-out"
            >
              <LabelList
                dataKey="count"
                position="right"
                style={CHART_LABEL_STYLE}
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
