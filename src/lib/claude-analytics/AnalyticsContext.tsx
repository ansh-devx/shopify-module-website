"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  ClaudeAnalyticsUser,
  normalizeUser,
} from "@/lib/claude-analytics/types";

interface AnalyticsContextValue {
  users: ClaudeAnalyticsUser[];
  loading: boolean;
  error: string | null;
  exportCSV: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function ClaudeAnalyticsProvider({ children }: { children: ReactNode }) {
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

  return (
    <AnalyticsContext.Provider value={{ users, loading, error, exportCSV }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsData(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error(
      "useAnalyticsData must be used within a ClaudeAnalyticsProvider"
    );
  }
  return ctx;
}
