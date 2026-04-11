"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Activity,
  Coins,
  Sparkles,
  MessageSquare,
  Wrench,
  Download,
  Zap,
  TrendingUp,
  Star,
  Cpu,
} from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Card } from "@/components/ui/Card";
import StatCard from "@/components/claude-analytics/StatCard";
import SectionHeader from "@/components/claude-analytics/SectionHeader";
import UsersTable from "@/components/claude-analytics/UsersTable";
import ProjectsTable from "@/components/claude-analytics/ProjectsTable";
import SkillsBarChart from "@/components/claude-analytics/SkillsBarChart";
import ModelsPieChart from "@/components/claude-analytics/ModelsPieChart";
import TopUsersChart from "@/components/claude-analytics/TopUsersChart";
import ToolsBarChart from "@/components/claude-analytics/ToolsBarChart";
import AgentsChart from "@/components/claude-analytics/AgentsChart";
import ActivityHeatmap from "@/components/claude-analytics/ActivityHeatmap";
import UsageTimeline from "@/components/claude-analytics/UsageTimeline";
import UserSpotlight from "@/components/claude-analytics/UserSpotlight";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
  SkeletonInsights,
} from "@/components/claude-analytics/Skeletons";
import {
  ClaudeAnalyticsUser,
  normalizeUser,
} from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import {
  aggregateField,
  aggregateProjects,
  computeInsights,
  aggregateDailyActivity,
  buildHeatmapData,
  buildSparkline,
} from "@/lib/claude-analytics/aggregate";
import { getSkillDisplayName } from "@/lib/claude-analytics/skillCategories";

export default function ClaudeAnalyticsPage() {
  const [users, setUsers] = useState<ClaudeAnalyticsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const hasFetched = useRef(false);

  const handleUserClick = useCallback(
    (email: string) => router.push(`/claude-analytics/users/${btoa(email)}`),
    [router]
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/claude-analytics/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then((data) => {
        const raw = Array.isArray(data) ? data : data?.users ?? [];
        setUsers(raw.map(normalizeUser));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Aggregate data ───────────────────────────────────────
  const stats = useMemo(() => {
    const totalSessions = users.reduce((s, u) => s + u.total_sessions, 0);
    const totalTokens = users.reduce((s, u) => s + u.total_tokens, 0);
    const totalSkillUses = users.reduce((s, u) => s + u.total_skill_uses, 0);
    const totalMessages = users.reduce((s, u) => s + u.message_count, 0);
    const totalToolUses = users.reduce((s, u) => s + u.total_tool_uses, 0);
    return {
      totalUsers: users.length,
      totalSessions,
      totalTokens,
      totalSkillUses,
      totalMessages,
      totalToolUses,
    };
  }, [users]);

  const aggregatedSkills = useMemo(
    () => aggregateField(users, "skills"),
    [users]
  );
  const aggregatedModels = useMemo(
    () => aggregateField(users, "models"),
    [users]
  );
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
  const insights = useMemo(() => computeInsights(users), [users]);

  // ── Time-series data ─────────────────────────────────────
  const dailyActivity = useMemo(
    () => aggregateDailyActivity(users),
    [users]
  );
  const heatmapData = useMemo(() => buildHeatmapData(users, 90), [users]);
  const sparklineSessions = useMemo(
    () => buildSparkline(users, "sessions", 14),
    [users]
  );
  const sparklineTokens = useMemo(
    () => buildSparkline(users, "tokens", 14),
    [users]
  );
  const sparklineMessages = useMemo(
    () => buildSparkline(users, "messages", 14),
    [users]
  );

  // ── CSV export ───────────────────────────────────────────
  const exportCSV = useCallback(() => {
    if (users.length === 0) return;
    const headers = [
      "Name",
      "Email",
      "Sessions",
      "Tokens",
      "Messages",
      "Tool Uses",
      "Skill Uses",
      "Last Active",
    ];
    const rows = users.map((u) => [
      u.user_name,
      u.user_email,
      u.total_sessions,
      u.total_tokens,
      u.message_count,
      u.total_tool_uses,
      u.total_skill_uses,
      u.last_active,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claude-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [users]);

  // ── Subtexts for stat cards ──────────────────────────────
  const subtexts = useMemo(() => {
    if (users.length === 0) return {};
    const avgTokens =
      stats.totalSessions > 0
        ? formatTokens(Math.round(stats.totalTokens / stats.totalSessions))
        : "0";
    const avgSessions =
      users.length > 0
        ? Math.round(stats.totalSessions / users.length)
        : 0;
    const avgMessages =
      stats.totalSessions > 0
        ? Math.round(stats.totalMessages / stats.totalSessions)
        : 0;
    return {
      users: `${stats.totalSessions > 0 ? avgSessions : 0} sessions/user avg`,
      sessions: `across ${users.length} users`,
      tokens: `~${avgTokens} per session`,
      messages: `~${avgMessages} per session`,
      tools: `${Object.keys(aggregatedTools).length} unique tools`,
      skills: `${Object.keys(aggregatedSkills).length} unique skills`,
    };
  }, [users, stats, aggregatedTools, aggregatedSkills]);

  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN} redirectTo="/">
      <div className="relative">
        {/* ── Hero Header ─────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-[300px] w-[300px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-glow" />
            <div className="absolute bottom-0 right-1/4 h-[200px] w-[200px] rounded-full bg-accent-warm/[0.03] blur-[80px] animate-float" />
          </div>

          <ScrollReveal>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                  Claude{" "}
                  <span className="text-gradient-shimmer">Analytics</span>
                </h1>
                <p className="mt-3 text-lg text-text-secondary max-w-2xl">
                  Team-wide Claude Code usage overview — sessions, tokens,
                  skills, and model distribution across all users.
                </p>
              </div>
              {!loading && users.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="shrink-0 mt-2 inline-flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/10 hover:border-accent/25 transition-all duration-300"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              )}
            </div>
          </ScrollReveal>
        </section>

        {error && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-400 text-sm">
              {error}
            </div>
          </section>
        )}

        <div className="space-y-12">
          {/* ── Summary Cards with Sparklines ─────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                <StaggerItem>
                  <StatCard
                    label="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    subtext={subtexts.users}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Sessions"
                    value={stats.totalSessions.toLocaleString()}
                    icon={Activity}
                    subtext={subtexts.sessions}
                    sparkline={sparklineSessions}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Tokens"
                    value={formatTokens(stats.totalTokens)}
                    icon={Coins}
                    subtext={subtexts.tokens}
                    sparkline={sparklineTokens}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Messages"
                    value={stats.totalMessages.toLocaleString()}
                    icon={MessageSquare}
                    subtext={subtexts.messages}
                    sparkline={sparklineMessages}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Tool Uses"
                    value={stats.totalToolUses.toLocaleString()}
                    icon={Wrench}
                    subtext={subtexts.tools}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Skill Uses"
                    value={stats.totalSkillUses.toLocaleString()}
                    icon={Sparkles}
                    subtext={subtexts.skills}
                  />
                </StaggerItem>
              </StaggerContainer>
            )}
          </section>

          {/* ── Quick Insights ────────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <SkeletonInsights />
            ) : (
              insights && (
                <ScrollReveal>
                  <Card className="p-5 border-accent-warm/10">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="rounded-lg bg-accent-warm/10 p-2">
                        <Zap className="h-4 w-4 text-accent-warm" />
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        Quick Insights
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      <div>
                        <p className="text-xs text-text-tertiary mb-0.5 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Most Active
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {insights.mostActiveUser}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-0.5 flex items-center gap-1">
                          <Coins className="h-3 w-3" /> Avg Tokens/Session
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {formatTokens(insights.avgTokensPerSession)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-0.5 flex items-center gap-1">
                          <Star className="h-3 w-3" /> Top Skill
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {insights.topSkill
                            ? getSkillDisplayName(insights.topSkill)
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-0.5 flex items-center gap-1">
                          <Cpu className="h-3 w-3" /> Top Model
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {insights.topModel || "N/A"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              )
            )}
          </section>

          {/* ── Activity Heatmap ──────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              title="Team"
              accent="Activity"
              description="Session activity across the past 90 days"
            />
            {loading ? (
              <SkeletonChart height={140} />
            ) : (
              <ScrollReveal delay={0.1}>
                <ActivityHeatmap data={heatmapData} />
              </ScrollReveal>
            )}
          </section>

          {/* ── Usage Timeline ────────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Usage" accent="Timeline" />
            {loading ? (
              <SkeletonChart height={280} />
            ) : (
              <ScrollReveal delay={0.1}>
                <UsageTimeline data={dailyActivity} />
              </ScrollReveal>
            )}
          </section>

          {/* ── User Spotlight (Top 3) ───────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              title="User"
              accent="Spotlight"
              description="Top contributors ranked by token consumption"
            />
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SkeletonChart height={200} />
                <SkeletonChart height={200} />
                <SkeletonChart height={200} />
              </div>
            ) : (
              <ScrollReveal delay={0.1}>
                <UserSpotlight users={users} />
              </ScrollReveal>
            )}
          </section>

          {/* ── Top Users Charts ──────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Top" accent="Users" />
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart height={320} />
                <SkeletonChart height={320} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScrollReveal delay={0.1}>
                  <TopUsersChart
                    users={users}
                    metric="total_tokens"
                    title="By Token Consumption"
                    color="#8dd5d6"
                    onUserClick={handleUserClick}
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <TopUsersChart
                    users={users}
                    metric="total_sessions"
                    title="By Session Count"
                    color="#d6b88d"
                    onUserClick={handleUserClick}
                  />
                </ScrollReveal>
              </div>
            )}
          </section>

          {/* ── Skills Distribution ───────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Skills" accent="Distribution" />
            {loading ? (
              <SkeletonChart height={400} />
            ) : (
              <ScrollReveal delay={0.1}>
                <SkillsBarChart skills={aggregatedSkills} />
              </ScrollReveal>
            )}
          </section>

          {/* ── Model Distribution ────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Model" accent="Distribution" />
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart height={280} />
                <SkeletonChart height={280} />
              </div>
            ) : (
              <ScrollReveal delay={0.1}>
                <ModelsPieChart models={aggregatedModels} />
              </ScrollReveal>
            )}
          </section>

          {/* ── Tools & Agents Distribution ───────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Tools & Agents" accent="Distribution" />
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart />
                <SkeletonChart />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScrollReveal delay={0.1}>
                  <ToolsBarChart tools={aggregatedTools} />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <AgentsChart agents={aggregatedAgents} />
                </ScrollReveal>
              </div>
            )}
          </section>

          {/* ── Projects Overview ─────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader title="Projects" accent="Overview" />
            {loading ? (
              <SkeletonTable />
            ) : (
              <ScrollReveal delay={0.1}>
                <ProjectsTable
                  projects={aggregatedProjects}
                  showActiveUsers
                />
              </ScrollReveal>
            )}
          </section>

          {/* ── Users Table ───────────────────────────────── */}
          <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
            <SectionHeader title="All" accent="Users" />
            {loading ? (
              <SkeletonTable rows={8} />
            ) : (
              <ScrollReveal delay={0.1}>
                <UsersTable users={users} />
              </ScrollReveal>
            )}
          </section>
        </div>
      </div>
    </RoleGuard>
  );
}
