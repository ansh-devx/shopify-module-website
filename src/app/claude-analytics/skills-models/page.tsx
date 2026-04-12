"use client";

import { useMemo } from "react";
import SectionHeader from "@/components/claude-analytics/SectionHeader";
import SkillsBarChart from "@/components/claude-analytics/SkillsBarChart";
import ModelsPieChart from "@/components/claude-analytics/ModelsPieChart";
import { SkeletonChart } from "@/components/claude-analytics/Skeletons";
import { aggregateField } from "@/lib/claude-analytics/aggregate";
import { useAnalyticsData } from "@/lib/claude-analytics/AnalyticsContext";

export default function SkillsModelsPage() {
  const { users, loading } = useAnalyticsData();

  const aggregatedSkills = useMemo(
    () => aggregateField(users, "skills"),
    [users]
  );
  const aggregatedModels = useMemo(
    () => aggregateField(users, "models"),
    [users]
  );

  return (
    <div className="space-y-8">
      {/* Skills Distribution */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader title="Skills" accent="Distribution" />
        {loading ? (
          <SkeletonChart height={400} />
        ) : (
          <SkillsBarChart skills={aggregatedSkills} />
        )}
      </section>

      {/* Model Distribution */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <SectionHeader title="Model" accent="Distribution" />
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart height={280} />
            <SkeletonChart height={280} />
          </div>
        ) : (
          <ModelsPieChart models={aggregatedModels} />
        )}
      </section>
    </div>
  );
}
