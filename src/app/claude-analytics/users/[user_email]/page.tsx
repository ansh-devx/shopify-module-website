"use client";

import { useEffect, useRef, useState, useMemo, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Coins,
  Sparkles,
  MessageSquare,
  Wrench,
  FolderOpen,
} from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Card } from "@/components/ui/Card";
import StatCard from "@/components/claude-analytics/StatCard";
import SectionHeader from "@/components/claude-analytics/SectionHeader";
import EmptyState from "@/components/claude-analytics/EmptyState";
import ProjectsTable, {
  type ProjectRow,
} from "@/components/claude-analytics/ProjectsTable";
import ModelsPieChart from "@/components/claude-analytics/ModelsPieChart";
import UserSkillsBreakdown from "@/components/claude-analytics/UserSkillsBreakdown";
import ToolsBarChart from "@/components/claude-analytics/ToolsBarChart";
import AgentsChart from "@/components/claude-analytics/AgentsChart";
import SessionsTable from "@/components/claude-analytics/SessionsTable";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
} from "@/components/claude-analytics/Skeletons";
import ActivityHeatmap from "@/components/claude-analytics/ActivityHeatmap";
import UsageTimeline from "@/components/claude-analytics/UsageTimeline";
import {
  ClaudeAnalyticsUser,
  normalizeUser,
} from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import {
  buildHeatmapData,
  aggregateDailyActivity,
} from "@/lib/claude-analytics/aggregate";

interface PageProps {
  params: Promise<{ user_email: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { user_email: encodedId } = use(params);
  const email = useMemo(() => {
    try {
      return atob(decodeURIComponent(encodedId));
    } catch {
      return encodedId;
    }
  }, [encodedId]);
  const [userData, setUserData] = useState<ClaudeAnalyticsUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch(`/api/claude-analytics/users/${encodedId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => setUserData(normalizeUser(data?.user ?? data)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [encodedId]);

  const projects = useMemo((): ProjectRow[] => {
    if (!userData) return [];
    return Object.entries(userData.projects).map(([name, data]) => ({
      name,
      tokens: data.tokens,
      skills: data.skills,
      sessions: data.sessions,
    }));
  }, [userData]);

  // Time-series data (wrap single user in array for aggregate helpers)
  const userAsArray = useMemo(
    () => (userData ? [userData] : []),
    [userData]
  );
  const heatmapData = useMemo(
    () => buildHeatmapData(userAsArray, 90),
    [userAsArray]
  );
  const dailyActivity = useMemo(
    () => aggregateDailyActivity(userAsArray),
    [userAsArray]
  );

  // Computed subtexts
  const subtexts = useMemo(() => {
    if (!userData) return {};
    const avgTokens =
      userData.total_sessions > 0
        ? formatTokens(
            Math.round(userData.total_tokens / userData.total_sessions)
          )
        : "0";
    const avgMessages =
      userData.total_sessions > 0
        ? Math.round(userData.message_count / userData.total_sessions)
        : 0;
    return {
      sessions: `across ${Object.keys(userData.projects).length} projects`,
      tokens: `~${avgTokens} per session`,
      messages: `~${avgMessages} per session`,
      tools: `${Object.keys(userData.tools).length} unique tools`,
      skills: `${Object.keys(userData.skills).filter((s) => userData.skills[s] > 0).length} active skills`,
    };
  }, [userData]);

  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN} redirectTo="/">
      <div className="relative">
        {/* Header */}
        <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-4 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 right-1/3 h-[250px] w-[250px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-glow" />
          </div>

          <ScrollReveal>
            <Link
              href="/claude-analytics"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </ScrollReveal>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </section>

        <div className="space-y-12">
          {/* User Info + Summary Cards */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <>
                <div className="mb-8">
                  <div className="h-10 w-48 rounded bg-surface-3 animate-pulse mb-2" />
                  <div className="h-4 w-64 rounded bg-surface-3/60 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </>
            ) : (
              userData && (
                <>
                  <ScrollReveal>
                    <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                      <span className="text-gradient-shimmer">
                        {userData.user_name}
                      </span>
                    </h1>
                    <p className="mt-2 text-text-tertiary">{email}</p>
                  </ScrollReveal>

                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
                    {[
                      { label: "Sessions", value: userData.total_sessions.toLocaleString(), icon: Activity, subtext: subtexts.sessions },
                      { label: "Tokens", value: formatTokens(userData.total_tokens), icon: Coins, subtext: subtexts.tokens },
                      { label: "Messages", value: userData.message_count.toLocaleString(), icon: MessageSquare, subtext: subtexts.messages },
                      { label: "Tool Uses", value: userData.total_tool_uses.toLocaleString(), icon: Wrench, subtext: subtexts.tools },
                      { label: "Skill Uses", value: userData.total_skill_uses.toLocaleString(), icon: Sparkles, subtext: subtexts.skills },
                    ].map((card) => (
                      <StaggerItem key={card.label}>
                        <StatCard {...card} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </>
              )
            )}
          </section>

          {/* Activity Heatmap */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              title="Session"
              accent="Activity"
              description="Activity across the past 90 days"
            />
            {loading ? (
              <SkeletonChart height={140} />
            ) : (
              userData && (
                <ScrollReveal delay={0.1}>
                  <ActivityHeatmap data={heatmapData} />
                </ScrollReveal>
              )
            )}
          </section>

          {/* Usage Timeline */}
          {!loading && dailyActivity.length > 1 && (
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
              <SectionHeader title="Usage" accent="Timeline" />
              <ScrollReveal delay={0.1}>
                <UsageTimeline data={dailyActivity} />
              </ScrollReveal>
            </section>
          )}

          {/* Skills Breakdown */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Skills" accent="Breakdown" />
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart height={380} />
                <SkeletonChart height={380} />
              </div>
            ) : (
              userData && (
                <ScrollReveal delay={0.1}>
                  <UserSkillsBreakdown skills={userData.skills} />
                </ScrollReveal>
              )
            )}
          </section>

          {/* Model Distribution */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Model" accent="Distribution" />
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart height={280} />
                <SkeletonChart height={280} />
              </div>
            ) : (
              userData && (
                <ScrollReveal delay={0.1}>
                  <ModelsPieChart models={userData.models} />
                </ScrollReveal>
              )
            )}
          </section>

          {/* Tools & Agents Breakdown */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Tools & Agents" accent="Breakdown" />
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart />
                <SkeletonChart />
              </div>
            ) : (
              userData && (
                <ScrollReveal delay={0.1}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ToolsBarChart tools={userData.tools} />
                    <AgentsChart agents={userData.agents} />
                  </div>
                </ScrollReveal>
              )
            )}
          </section>

          {/* Session History */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Session" accent="History" />
            {loading ? (
              <SkeletonTable rows={6} />
            ) : (
              userData && (
                <ScrollReveal delay={0.1}>
                  <div className="space-y-6">
                    {Object.entries(userData.projects)
                      .filter(
                        ([, p]) => Object.keys(p.session_details).length > 0
                      )
                      .map(([name, project]) => (
                        <SessionsTable
                          key={name}
                          sessions={project.session_details}
                          projectName={name}
                        />
                      ))}
                    {Object.values(userData.projects).every(
                      (p) => Object.keys(p.session_details).length === 0
                    ) && (
                      <Card className="p-0 overflow-hidden">
                        <EmptyState
                          icon={Activity}
                          title="No session history"
                          description="No session details have been recorded yet."
                        />
                      </Card>
                    )}
                  </div>
                </ScrollReveal>
              )
            )}
          </section>

          {/* Projects */}
          <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
            <SectionHeader title="" accent="Projects" />
            {loading ? (
              <SkeletonTable />
            ) : projects.length === 0 ? (
              <Card className="p-0 overflow-hidden">
                <EmptyState
                  icon={FolderOpen}
                  title="No project data"
                  description="No project activity has been recorded yet."
                />
              </Card>
            ) : (
              <ScrollReveal delay={0.1}>
                <ProjectsTable projects={projects} />
              </ScrollReveal>
            )}
          </section>
        </div>
      </div>
    </RoleGuard>
  );
}
