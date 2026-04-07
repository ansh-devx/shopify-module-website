"use client";

import { useEffect, useRef, useState, useMemo, use } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Coins, Sparkles } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import Loader from "@/components/ui/Loader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import StatCard from "@/components/claude-analytics/StatCard";
import ProjectsTable, {
  type ProjectRow,
} from "@/components/claude-analytics/ProjectsTable";
import ModelsPieChart from "@/components/claude-analytics/ModelsPieChart";
import UserSkillsBreakdown from "@/components/claude-analytics/UserSkillsBreakdown";
import { ClaudeAnalyticsUser, normalizeUser } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { Card } from "@/components/ui/Card";

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

  const modelsTable = useMemo(() => {
    if (!userData) return [];
    const total = Object.values(userData.models).reduce((s, v) => s + v, 0);
    return Object.entries(userData.models)
      .map(([name, sessions]) => ({
        name,
        sessions,
        percent: total > 0 ? ((sessions / total) * 100).toFixed(0) : "0",
      }))
      .sort((a, b) => b.sessions - a.sessions);
  }, [userData]);

  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN} redirectTo="/">
      <div className="relative">
        {/* Header */}
        <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-4 lg:px-8">
          {/* Background effects */}
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

          {loading && (
            <div className="flex justify-center py-24">
              <Loader />
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </section>

        {!loading && !error && userData && (
          <>
            {/* User Info + Summary Cards */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8">
              <ScrollReveal>
                <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                  <span className="text-gradient-shimmer">
                    {userData.user_name}
                  </span>
                </h1>
                <p className="mt-2 text-text-tertiary">{email}</p>
              </ScrollReveal>

              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <StaggerItem>
                  <StatCard
                    label="Sessions"
                    value={userData.total_sessions.toLocaleString()}
                    icon={Activity}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Tokens"
                    value={formatTokens(userData.total_tokens)}
                    icon={Coins}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Skill Uses"
                    value={userData.total_skill_uses.toLocaleString()}
                    icon={Sparkles}
                  />
                </StaggerItem>
              </StaggerContainer>
            </section>

            {/* Skills Breakdown */}
            <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  Skills{" "}
                  <span className="text-gradient italic">Breakdown</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <UserSkillsBreakdown skills={userData.skills} />
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ModelsPieChart models={userData.models} />
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      Model Usage
                    </h3>
                    <p className="text-sm text-text-tertiary mb-4">
                      Session breakdown by model
                    </p>
                    {modelsTable.length === 0 ? (
                      <p className="text-sm text-text-tertiary py-8 text-center">
                        No model data available
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {modelsTable.map((m) => (
                          <div
                            key={m.name}
                            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-2 transition-colors"
                          >
                            <span className="text-sm font-medium text-text-primary">
                              {m.name.replace("claude-", "")}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-text-secondary tabular-nums">
                                {m.sessions} sessions
                              </span>
                              <span className="text-xs text-text-tertiary tabular-nums w-10 text-right">
                                {m.percent}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </ScrollReveal>
            </section>

            {/* Projects */}
            <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
              <ScrollReveal>
                <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl mb-6">
                  <span className="text-gradient italic">Projects</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                {projects.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-sm text-text-tertiary">
                      No project data available
                    </p>
                  </Card>
                ) : (
                  <ProjectsTable projects={projects} />
                )}
              </ScrollReveal>
            </section>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
