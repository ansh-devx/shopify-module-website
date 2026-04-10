"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ClaudeAnalyticsUser } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { formatRelativeTime } from "@/lib/claude-analytics/formatTime";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";

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

export default function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("total_tokens");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...users].sort((a, b) => {
    let cmp: number;
    if (sortKey === "user_name") {
      cmp = a.user_name.localeCompare(b.user_name);
    } else if (sortKey === "last_active") {
      cmp =
        new Date(a.last_active).getTime() - new Date(b.last_active).getTime();
    } else {
      cmp = a[sortKey] - b[sortKey];
    }
    return sortAsc ? cmp : -cmp;
  });

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
      return <ChevronDown className="inline h-3.5 w-3.5 opacity-0 group-hover/th:opacity-40" />;
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

  return (
    <Card className="p-0 overflow-hidden">
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
            {sorted.map((user, i) => (
              <tr
                key={user.user_email}
                onClick={() =>
                  router.push(
                    `/claude-analytics/users/${btoa(user.user_email)}`
                  )
                }
                className={`border-b border-accent/5 hover:bg-accent/5 cursor-pointer transition-colors ${
                  i === 0 ? "bg-accent/[0.03]" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {user.user_name}
                    </p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {user.user_email}
                    </p>
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
                  <ExternalLink className="h-3.5 w-3.5 text-text-tertiary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
