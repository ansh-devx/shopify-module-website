"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  getSkillCategory,
  getSkillDisplayName,
  SKILL_CATEGORY_COLORS,
  type SkillCategory,
} from "@/lib/claude-analytics/skillCategories";
import {
  CHART_TOOLTIP_STYLE,
  CHART_GRID_PROPS,
  CHART_AXIS_TICK,
  BAR_ACTIVE_STYLE,
} from "./chartConfig";

interface SkillsBarChartProps {
  skills: Record<string, number>;
  title?: string;
  showZero?: boolean;
}

const TOP_N = 12;

export default function SkillsBarChart({
  skills,
  title = "Skills Distribution",
  showZero = true,
}: SkillsBarChartProps) {
  const [showAll, setShowAll] = useState(false);

  const skillKeys = showZero
    ? Object.keys(skills)
    : Object.keys(skills).filter((s) => skills[s] > 0);

  const allData = skillKeys
    .map((skill) => ({
      name: getSkillDisplayName(skill),
      fullName: skill,
      count: skills[skill] || 0,
      category: getSkillCategory(skill),
    }))
    .sort((a, b) => b.count - a.count);

  const hasMore = allData.length > TOP_N;
  const data = hasMore && !showAll ? allData.slice(0, TOP_N) : allData;

  const legendPayload = (
    Object.keys(SKILL_CATEGORY_COLORS) as SkillCategory[]
  ).map((cat) => ({
    value: cat,
    type: "square" as const,
    color: SKILL_CATEGORY_COLORS[cat],
  }));

  const chartHeight = Math.max(400, data.length * 28 + 100);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {showAll ? (
              <>
                Show Top {TOP_N} <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show All ({allData.length}) <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>
      <p className="text-sm text-text-tertiary mb-6">
        Usage count across {data.length}
        {hasMore && !showAll ? ` of ${allData.length}` : ""}{" "}
        {showZero ? "" : "active "}
        skill{data.length !== 1 ? "s" : ""}
      </p>
      <div
        className="max-h-[520px] overflow-y-auto"
        style={{ height: Math.min(chartHeight, 520) }}
      >
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid {...CHART_GRID_PROPS} vertical={false} />
            <XAxis
              dataKey="name"
              tick={CHART_AXIS_TICK.small}
              angle={-45}
              textAnchor="end"
              height={80}
              axisLine={{ stroke: "rgba(141,213,214,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={CHART_AXIS_TICK.secondary}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...CHART_TOOLTIP_STYLE}
              /* eslint-disable @typescript-eslint/no-explicit-any */
              formatter={((value: any, _name: any, props: any) => [
                value,
                props?.payload?.category || "",
              ]) as any}
              /* eslint-enable @typescript-eslint/no-explicit-any */
            />
            {/* @ts-expect-error recharts Legend payload type is overly strict */}
            <Legend payload={legendPayload} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              fill="#8dd5d6"
              activeBar={BAR_ACTIVE_STYLE}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
