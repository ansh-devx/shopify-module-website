"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Users, Activity, Coins, Sparkles } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import Loader from "@/components/ui/Loader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import StatCard from "@/components/claude-analytics/StatCard";
import UsersTable from "@/components/claude-analytics/UsersTable";
import ProjectsTable, {
  type ProjectRow,
} from "@/components/claude-analytics/ProjectsTable";
import SkillsBarChart from "@/components/claude-analytics/SkillsBarChart";
import ModelsPieChart from "@/components/claude-analytics/ModelsPieChart";
import TopUsersChart from "@/components/claude-analytics/TopUsersChart";
import { ClaudeAnalyticsUser, normalizeUser } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";

export default function ClaudeAnalyticsPage() {
  const [users, setUsers] = useState<ClaudeAnalyticsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

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

  const stats = useMemo(() => {
    const totalSessions = users.reduce((s, u) => s + u.total_sessions, 0);
    const totalTokens = users.reduce((s, u) => s + u.total_tokens, 0);
    const totalSkillUses = users.reduce((s, u) => s + u.total_skill_uses, 0);
    return {
      totalUsers: users.length,
      totalSessions,
      totalTokens,
      totalSkillUses,
    };
  }, [users]);

  const aggregatedSkills = useMemo(() => {
    const skills: Record<string, number> = {};
    users.forEach((u) => {
      Object.entries(u.skills).forEach(([skill, count]) => {
        skills[skill] = (skills[skill] || 0) + count;
      });
    });
    return skills;
  }, [users]);

  const aggregatedModels = useMemo(() => {
    const models: Record<string, number> = {};
    users.forEach((u) => {
      Object.entries(u.models).forEach(([model, count]) => {
        models[model] = (models[model] || 0) + count;
      });
    });
    return models;
  }, [users]);

  const aggregatedProjects = useMemo(() => {
    const projectMap: Record<
      string,
      {
        tokens: number;
        skills: number;
        sessions: number;
        userSet: Set<string>;
      }
    > = {};
    users.forEach((u) => {
      Object.entries(u.projects).forEach(([name, data]) => {
        if (!projectMap[name]) {
          projectMap[name] = {
            tokens: 0,
            skills: 0,
            sessions: 0,
            userSet: new Set(),
          };
        }
        projectMap[name].tokens += data.tokens;
        projectMap[name].skills += data.skills;
        projectMap[name].sessions += data.sessions;
        projectMap[name].userSet.add(u.user_email);
      });
    });
    return Object.entries(projectMap).map(
      ([name, { tokens, skills, sessions, userSet }]): ProjectRow => ({
        name,
        tokens,
        skills,
        sessions,
        activeUsers: userSet.size,
      })
    );
  }, [users]);

  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN} redirectTo="/">
      <div className="relative">
        {/* Hero Header */}
        <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-8">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-[300px] w-[300px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-glow" />
            <div className="absolute bottom-0 right-1/4 h-[200px] w-[200px] rounded-full bg-accent-warm/[0.03] blur-[80px] animate-float" />
          </div>

          <ScrollReveal>
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
              Claude{" "}
              <span className="text-gradient-shimmer">Analytics</span>
            </h1>
            <p className="mt-3 text-lg text-text-secondary max-w-2xl">
              Team-wide Claude Code usage overview — sessions, tokens, skills,
              and model distribution across all users.
            </p>
          </ScrollReveal>
        </section>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader />
          </div>
        )}

        {error && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-400 text-sm">
              {error}
            </div>
          </section>
        )}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StaggerItem>
                  <StatCard
                    label="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Sessions"
                    value={stats.totalSessions.toLocaleString()}
                    icon={Activity}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Tokens"
                    value={formatTokens(stats.totalTokens)}
                    icon={Coins}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Skill Uses"
                    value={stats.totalSkillUses.toLocaleString()}
                    icon={Sparkles}
                  />
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Top Users Charts */}
            <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  Top <span className="text-gradient italic">Users</span>
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScrollReveal delay={0.1}>
                  <TopUsersChart
                    users={users}
                    metric="total_tokens"
                    title="By Token Consumption"
                    color="#8dd5d6"
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <TopUsersChart
                    users={users}
                    metric="total_sessions"
                    title="By Session Count"
                    color="#d6b88d"
                  />
                </ScrollReveal>
              </div>
            </section>

            {/* Skills Distribution */}
            <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  Skills{" "}
                  <span className="text-gradient italic">Distribution</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <SkillsBarChart skills={aggregatedSkills} />
              </ScrollReveal>
            </section>

            {/* Model Distribution */}
            <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  Model{" "}
                  <span className="text-gradient italic">Distribution</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="max-w-lg mx-auto">
                  <ModelsPieChart models={aggregatedModels} />
                </div>
              </ScrollReveal>
            </section>

            {/* Projects Overview */}
            <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  Projects{" "}
                  <span className="text-gradient italic">Overview</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ProjectsTable
                  projects={aggregatedProjects}
                  showActiveUsers
                />
              </ScrollReveal>
            </section>

            {/* Users Table */}
            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  All <span className="text-gradient italic">Users</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <UsersTable users={users} />
              </ScrollReveal>
            </section>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
