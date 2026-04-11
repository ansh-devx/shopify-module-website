"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ClaudeAnalyticsUser } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { formatRelativeTime } from "@/lib/claude-analytics/formatTime";
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SortKey =
  | "user_name"
  | "total_sessions"
  | "total_tokens"
  | "message_count"
  | "total_tool_uses"
  | "total_skill_uses"
  | "last_active";

interface UsersTableProps {
  users: ClaudeAnalyticsUser[];
}

const PAGE_SIZE = 10;

export default function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("total_tokens");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.user_name.toLowerCase().includes(q) ||
        u.user_email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp: number;
      if (sortKey === "user_name") {
        cmp = a.user_name.localeCompare(b.user_name);
      } else if (sortKey === "last_active") {
        cmp =
          new Date(a.last_active).getTime() -
          new Date(b.last_active).getTime();
      } else {
        cmp = a[sortKey] - b[sortKey];
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when search changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column)
      return (
        <ChevronDown className="inline h-3.5 w-3.5 opacity-0 group-hover/th:opacity-40" />
      );
    return sortAsc ? (
      <ChevronUp className="inline h-3.5 w-3.5 text-accent" />
    ) : (
      <ChevronDown className="inline h-3.5 w-3.5 text-accent" />
    );
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "user_name", label: "Name" },
    { key: "total_sessions", label: "Sessions" },
    { key: "total_tokens", label: "Tokens" },
    { key: "message_count", label: "Messages" },
    { key: "total_tool_uses", label: "Tool Uses" },
    { key: "total_skill_uses", label: "Skill Uses" },
    { key: "last_active", label: "Last Active" },
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Search Bar */}
      <div className="px-5 py-3 border-b border-accent/10 flex items-center gap-3">
        <Search className="h-4 w-4 text-text-tertiary shrink-0" />
        <input
          type="text"
          placeholder="Search users..."
          className="bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none flex-1 min-w-0"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {search && (
          <span className="text-xs text-text-tertiary shrink-0">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="group/th px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary cursor-pointer hover:text-text-secondary transition-colors"
                >
                  {col.label} <SortIcon column={col.key} />
                </th>
              ))}
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {paginated.map((user, i) => (
              <tr
                key={user.user_email}
                onClick={() =>
                  router.push(
                    `/claude-analytics/users/${btoa(user.user_email)}`
                  )
                }
                className={`group/row border-b border-accent/5 hover:bg-accent/5 cursor-pointer transition-colors ${
                  i === 0 && page === 0 ? "bg-accent/[0.03]" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-accent">
                        {getInitials(user.user_name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user.user_name}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5 truncate">
                        {user.user_email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {user.total_sessions.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {formatTokens(user.total_tokens)}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {user.message_count.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {user.total_tool_uses.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {user.total_skill_uses.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary">
                  {formatRelativeTime(user.last_active)}
                </td>
                <td className="px-3 py-3.5">
                  <ExternalLink className="h-3.5 w-3.5 text-text-tertiary opacity-0 group-hover/row:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-text-tertiary"
                >
                  {search
                    ? "No users match your search."
                    : "No user data available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-accent/10 flex items-center justify-between">
          <p className="text-xs text-text-tertiary">
            Showing {page * PAGE_SIZE + 1}&ndash;
            {Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-text-secondary" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-7 min-w-[28px] rounded-lg text-xs font-medium transition-colors ${
                  i === page
                    ? "bg-accent/15 text-accent"
                    : "text-text-tertiary hover:bg-surface-2 hover:text-text-secondary"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-text-secondary" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
