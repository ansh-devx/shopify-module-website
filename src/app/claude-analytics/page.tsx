"use client";

import { useMemo } from "react";
import {
  Users,
  Activity,
  Coins,
  Sparkles,
  MessageSquare,
  Wrench,
  Zap,
  TrendingUp,
  Star,
  Cpu,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import StatCard from "@/components/claude-analytics/StatCard";
import SectionHeader from "@/components/claude-analytics/SectionHeader";
import ActivityHeatmap from "@/components/claude-analytics/ActivityHeatmap";
import UsageTimeline from "@/components/claude-analytics/UsageTimeline";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonInsights,
} from "@/components/claude-analytics/Skeletons";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import {
  aggregateField,
  computeInsights,
  aggregateDailyActivity,
  buildHeatmapData,
  buildSparkline,
} from "@/lib/claude-analytics/aggregate";
import { getSkillDisplayName } from "@/lib/claude-analytics/skillCategories";
import { useAnalyticsData } from "@/lib/claude-analytics/AnalyticsContext";

export default function ClaudeAnalyticsOverview() {
  const { users, loading, error } = useAnalyticsData();

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
    [users],
  );
  const aggregatedTools = useMemo(
    () => aggregateField(users, "tools"),
    [users],
  );
  const insights = useMemo(() => computeInsights(users), [users]);
  const dailyActivity = useMemo(() => aggregateDailyActivity(users), [users]);
  const heatmap = useMemo(() => buildHeatmapData(users, 90), [users]);
  const sparklineSessions = useMemo(
    () => buildSparkline(users, "sessions", 14),
    [users],
  );
  const sparklineTokens = useMemo(
    () => buildSparkline(users, "tokens", 14),
    [users],
  );
  const sparklineMessages = useMemo(
    () => buildSparkline(users, "messages", 14),
    [users],
  );

  const subtexts = useMemo(() => {
    if (users.length === 0) return {};
    const avgTokens =
      stats.totalSessions > 0
        ? formatTokens(Math.round(stats.totalTokens / stats.totalSessions))
        : "0";
    const avgSessions =
      users.length > 0 ? Math.round(stats.totalSessions / users.length) : 0;
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
    <>
      {error && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-400 text-sm">
            {error}
          </div>
        </section>
      )}

      <div className="space-y-8">
        {/* Summary Cards */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  icon: Users,
                  subtext: subtexts.users,
                },
                {
                  label: "Total Sessions",
                  value: stats.totalSessions.toLocaleString(),
                  icon: Activity,
                  subtext: subtexts.sessions,
                  sparkline: sparklineSessions,
                },
                {
                  label: "Total Tokens",
                  value: formatTokens(stats.totalTokens),
                  icon: Coins,
                  subtext: subtexts.tokens,
                  sparkline: sparklineTokens,
                },
                {
                  label: "Total Messages",
                  value: stats.totalMessages.toLocaleString(),
                  icon: MessageSquare,
                  subtext: subtexts.messages,
                  sparkline: sparklineMessages,
                },
                {
                  label: "Total Tool Uses",
                  value: stats.totalToolUses.toLocaleString(),
                  icon: Wrench,
                  subtext: subtexts.tools,
                },
                {
                  label: "Total Skill Uses",
                  value: stats.totalSkillUses.toLocaleString(),
                  icon: Sparkles,
                  subtext: subtexts.skills,
                },
              ].map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Insights */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <SkeletonInsights />
          ) : (
            insights && (
              <Card className="p-5 border-accent-warm/10">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="rounded-lg bg-accent-warm/10 p-2">
                    <Zap className="h-4 w-4 text-accent-warm" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Quick Insights
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            )
          )}
        </section>

        {/* Activity Heatmap */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            title="Team"
            accent="Activity"
            description="Session activity across all recorded history"
          />
          {loading ? (
            <SkeletonChart height={140} />
          ) : (
            <ActivityHeatmap
              data={heatmap.days}
              unknownCount={heatmap.unknownCount}
            />
          )}
        </section>

        {/* Usage Timeline */}
        <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
          <SectionHeader title="Usage" accent="Timeline" />
          {loading ? (
            <SkeletonChart height={280} />
          ) : (
            <UsageTimeline
              data={dailyActivity.daily}
              unknown={dailyActivity.unknown}
            />
          )}
        </section>
      </div>
    </>
  );
}
