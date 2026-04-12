"use client";

import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import {
  ClaudeAnalyticsProvider,
  useAnalyticsData,
} from "@/lib/claude-analytics/AnalyticsContext";

const DASHBOARD_ROUTES = [
  "/claude-analytics",
  "/claude-analytics/users",
  "/claude-analytics/skills-models",
  "/claude-analytics/tools-projects",
];

function AnalyticsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, users, exportCSV } = useAnalyticsData();

  const isDashboardRoute = DASHBOARD_ROUTES.includes(pathname);

  if (!isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <div>
      {/* Hero Header */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-8">
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
              className="shrink-0 mt-2 inline-flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/10 hover:border-accent/25 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </section>

      {children}
    </div>
  );
}

export default function ClaudeAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN} redirectTo="/">
      <ClaudeAnalyticsProvider>
        <AnalyticsShell>{children}</AnalyticsShell>
      </ClaudeAnalyticsProvider>
    </RoleGuard>
  );
}
