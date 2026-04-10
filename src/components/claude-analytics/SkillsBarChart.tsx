"use client";

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
import {
  getSkillCategory,
  getSkillDisplayName,
  SKILL_CATEGORY_COLORS,
  type SkillCategory,
} from "@/lib/claude-analytics/skillCategories";

interface SkillsBarChartProps {
  skills: Record<string, number>;
  title?: string;
  showZero?: boolean;
}

export default function SkillsBarChart({
  skills,
  title = "Skills Distribution",
  showZero = true,
}: SkillsBarChartProps) {
  const skillKeys = showZero
    ? Object.keys(skills)
    : Object.keys(skills).filter((s) => skills[s] > 0);

  const data = skillKeys
    .map((skill) => ({
      name: getSkillDisplayName(skill),
      fullName: skill,
      count: skills[skill] || 0,
      category: getSkillCategory(skill),
      fill: "#8dd5d6",
    }))
    .sort((a, b) => b.count - a.count);

  const legendPayload = (
    Object.keys(SKILL_CATEGORY_COLORS) as SkillCategory[]
  ).map((cat) => ({
    value: cat,
    type: "square" as const,
    color: SKILL_CATEGORY_COLORS[cat],
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-tertiary mb-6">
        Usage count across {data.length} {showZero ? "" : "active "}skill
        {data.length !== 1 ? "s" : ""}
      </p>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(141,213,214,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-tertiary)", fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
              axisLine={{ stroke: "rgba(141,213,214,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
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
              formatter={((value: any, _name: any, props: any) => [value, props?.payload?.category || ""]) as any}
            />
            {/* @ts-expect-error recharts Legend payload type is overly strict */}
            <Legend payload={legendPayload} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#8dd5d6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
