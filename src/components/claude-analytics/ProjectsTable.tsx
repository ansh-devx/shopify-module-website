"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface ProjectRow {
  name: string;
  tokens: number;
  skills: number;
  sessions: number;
  activeUsers?: number;
}

type SortKey = "name" | "tokens" | "skills" | "sessions" | "activeUsers";

interface ProjectsTableProps {
  projects: ProjectRow[];
  showActiveUsers?: boolean;
}

export default function ProjectsTable({
  projects,
  showActiveUsers = false,
}: ProjectsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("tokens");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => {
      let cmp: number;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [projects, sortKey, sortAsc]);

  const maxTokens = useMemo(
    () => Math.max(...projects.map((p) => p.tokens), 1),
    [projects]
  );

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

  const columns: { key: SortKey; label: string; show?: boolean }[] = [
    { key: "name", label: "Project" },
    { key: "tokens", label: "Tokens" },
    { key: "skills", label: "Skill Uses" },
    { key: "sessions", label: "Sessions" },
    { key: "activeUsers", label: "Active Users", show: showActiveUsers },
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/10">
              {columns
                .filter((c) => c.show !== false)
                .map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="group/th px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary cursor-pointer hover:text-text-secondary transition-colors"
                  >
                    {col.label} <SortIcon column={col.key} />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((project, i) => (
              <tr
                key={project.name}
                className={`border-b border-accent/5 hover:bg-accent/5 transition-colors ${
                  i === 0 ? "bg-accent/[0.03]" : ""
                }`}
              >
                <td className="px-5 py-3.5 text-sm font-medium text-text-primary">
                  {project.name}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-text-secondary tabular-nums">
                      {formatTokens(project.tokens)}
                    </span>
                    <div className="h-1.5 w-16 rounded-full bg-surface-3 overflow-hidden shrink-0">
                      <div
                        className="h-full rounded-full bg-accent/50 transition-all duration-500"
                        style={{
                          width: `${(project.tokens / maxTokens) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {project.skills.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {project.sessions.toLocaleString()}
                </td>
                {showActiveUsers && (
                  <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                    {project.activeUsers}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
