"use client";

import { Card } from "@/components/ui/Card";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";

export interface ProjectRow {
  name: string;
  tokens: number;
  skills: number;
  sessions: number;
  activeUsers?: number;
}

interface ProjectsTableProps {
  projects: ProjectRow[];
  showActiveUsers?: boolean;
}

export default function ProjectsTable({
  projects,
  showActiveUsers = false,
}: ProjectsTableProps) {
  const sorted = [...projects].sort((a, b) => b.tokens - a.tokens);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/10">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Project
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Tokens
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Skill Uses
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Sessions
              </th>
              {showActiveUsers && (
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Active Users
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((project, i) => (
              <tr
                key={project.name}
                className={`border-b border-accent/5 ${
                  i === 0 ? "bg-accent/[0.03]" : ""
                }`}
              >
                <td className="px-5 py-3.5 text-sm font-medium text-text-primary">
                  {project.name}
                </td>
                <td className="px-5 py-3.5 text-sm text-text-secondary tabular-nums">
                  {formatTokens(project.tokens)}
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
