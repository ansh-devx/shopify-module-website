"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/claude-analytics/SectionHeader";
import UserSpotlight from "@/components/claude-analytics/UserSpotlight";
import TopUsersChart from "@/components/claude-analytics/TopUsersChart";
import UsersTable from "@/components/claude-analytics/UsersTable";
import {
  SkeletonChart,
  SkeletonTable,
} from "@/components/claude-analytics/Skeletons";
import { useAnalyticsData } from "@/lib/claude-analytics/AnalyticsContext";

export default function UsersPage() {
  const { users, loading } = useAnalyticsData();
  const router = useRouter();

  const handleUserClick = useCallback(
    (email: string) => router.push(`/claude-analytics/users/${btoa(email)}`),
    [router]
  );

  return (
    <div className="space-y-8">
      {/* User Spotlight (Top 3) */}
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
          <UserSpotlight users={users} />
        )}
      </section>

      {/* Top Users Charts */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader title="Top" accent="Users" />
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart height={320} />
            <SkeletonChart height={320} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopUsersChart
              users={users}
              metric="total_tokens"
              title="By Token Consumption"
              color="#8dd5d6"
              onUserClick={handleUserClick}
            />
            <TopUsersChart
              users={users}
              metric="total_sessions"
              title="By Session Count"
              color="#d6b88d"
              onUserClick={handleUserClick}
            />
          </div>
        )}
      </section>

      {/* All Users Table */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <SectionHeader title="All" accent="Users" />
        {loading ? (
          <SkeletonTable rows={8} />
        ) : (
          <UsersTable users={users} />
        )}
      </section>
    </div>
  );
}
