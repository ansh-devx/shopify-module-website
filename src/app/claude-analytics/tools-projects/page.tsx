"use client";

import { useMemo } from "react";
import SectionHeader from "@/components/claude-analytics/SectionHeader";
import ToolsBarChart from "@/components/claude-analytics/ToolsBarChart";
import AgentsChart from "@/components/claude-analytics/AgentsChart";
import ProjectsTable from "@/components/claude-analytics/ProjectsTable";
import { SkeletonChart, SkeletonTable } from "@/components/claude-analytics/Skeletons";
import {
  aggregateField,
  aggregateProjects,
} from "@/lib/claude-analytics/aggregate";
import { useAnalyticsData } from "@/lib/claude-analytics/AnalyticsContext";

export default function ToolsProjectsPage() {
  const { users, loading } = useAnalyticsData();

  const aggregatedTools = useMemo(
    () => aggregateField(users, "tools"),
    [users]
  );
  const aggregatedAgents = useMemo(
    () => aggregateField(users, "agents"),
    [users]
  );
  const aggregatedProjects = useMemo(
    () => aggregateProjects(users),
    [users]
  );

  return (
    <div className="space-y-8">
      {/* Tools & Agents Distribution */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader title="Tools & Agents" accent="Distribution" />
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ToolsBarChart tools={aggregatedTools} />
            <AgentsChart agents={aggregatedAgents} />
          </div>
        )}
      </section>

      {/* Projects Overview */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <SectionHeader title="Projects" accent="Overview" />
        {loading ? (
          <SkeletonTable />
        ) : (
          <ProjectsTable
            projects={aggregatedProjects}
            showActiveUsers
          />
        )}
      </section>
    </div>
  );
}
