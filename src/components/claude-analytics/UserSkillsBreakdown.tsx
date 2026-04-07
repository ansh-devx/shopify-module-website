"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import {
  SKILLS_BY_CATEGORY,
  SKILL_CATEGORY_COLORS,
  type SkillCategory,
} from "@/lib/claude-analytics/skillCategories";

interface UserSkillsBreakdownProps {
  skills: Record<string, number>;
}

export default function UserSkillsBreakdown({
  skills,
}: UserSkillsBreakdownProps) {
  const chartData = Object.entries(skills)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Skills Usage
        </h3>
        <p className="text-sm text-text-tertiary mb-4">
          {chartData.length} active skill{chartData.length !== 1 ? "s" : ""}
        </p>
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#8dd5d6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Grouped Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Skills by Category
        </h3>
        <p className="text-sm text-text-tertiary mb-4">
          Grouped by workflow type
        </p>
        <div className="space-y-5 max-h-[380px] overflow-y-auto">
          {(Object.keys(SKILLS_BY_CATEGORY) as SkillCategory[]).map(
            (category) => {
              const categorySkills = SKILLS_BY_CATEGORY[category]
                .map((name) => ({ name, count: skills[name] || 0 }))
                .sort((a, b) => b.count - a.count);

              const categoryTotal = categorySkills.reduce(
                (s, sk) => s + sk.count,
                0
              );

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{
                          backgroundColor: SKILL_CATEGORY_COLORS[category],
                        }}
                      />
                      <span className="text-sm font-semibold text-text-primary">
                        {category}
                      </span>
                    </div>
                    <span className="text-xs text-text-tertiary tabular-nums">
                      {categoryTotal} uses
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-surface-2 transition-colors"
                      >
                        <span className="text-sm text-text-secondary">
                          {skill.name}
                        </span>
                        <span className="text-sm font-medium text-text-primary tabular-nums">
                          {skill.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Card>
    </div>
  );
}
