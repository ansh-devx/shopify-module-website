"use client";

import { useState, Fragment } from "react";
import { Card } from "@/components/ui/Card";
import { ChevronRight, ChevronDown } from "lucide-react";
import { SessionDetail } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { formatRelativeTime } from "@/lib/claude-analytics/formatTime";
import { getSkillDisplayName } from "@/lib/claude-analytics/skillCategories";

interface SessionsTableProps {
  sessions: Record<string, SessionDetail>;
  projectName?: string;
}

export default function SessionsTable({
  sessions,
  projectName,
}: SessionsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = Object.entries(sessions).sort(
    ([, a], [, b]) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  );

  if (sorted.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-text-tertiary text-center">
          No session data available
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      {projectName && (
        <div className="px-5 py-3 border-b border-accent/10">
          <h4 className="text-sm font-semibold text-text-primary">
            {projectName}
          </h4>
          <p className="text-xs text-text-tertiary mt-0.5">
            {sorted.length} session{sorted.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/10">
              <th className="px-5 py-3 w-8" />
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Session
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Tokens
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Messages
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Models
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Started
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([id, session]) => {
              const isExpanded = expandedId === id;
              const toolEntries = Object.entries(session.tools).sort(
                ([, a], [, b]) => b - a
              );
              const skillEntries = Object.entries(session.skills).sort(
                ([, a], [, b]) => b - a
              );
              const agentEntries = Object.entries(session.agents).sort(
                ([, a], [, b]) => b - a
              );
              const hasDetails =
                toolEntries.length > 0 ||
                skillEntries.length > 0 ||
                agentEntries.length > 0;

              return (
                <Fragment key={id}>
                  <tr
                    onClick={() =>
                      hasDetails &&
                      setExpandedId(isExpanded ? null : id)
                    }
                    className={`border-b border-accent/5 transition-colors ${
                      hasDetails
                        ? "cursor-pointer hover:bg-accent/5"
                        : ""
                    } ${isExpanded ? "bg-accent/[0.03]" : ""}`}
                  >
                    <td className="px-3 py-3">
                      {hasDetails &&
                        (isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-accent" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
                        ))}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-text-primary truncate max-w-[240px]">
                        {session.name || (
                          <span className="text-text-tertiary italic">
                            Untitled
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-text-tertiary mt-0.5 font-mono">
                        {id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary tabular-nums">
                      {formatTokens(session.tokens)}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary tabular-nums">
                      {session.messages.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {session.models
                        .map((m) => m.replace("claude-", ""))
                        .join(", ")}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-secondary">
                      {formatRelativeTime(session.started_at)}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-accent/5 bg-accent/[0.02]">
                      <td colSpan={6} className="px-8 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {toolEntries.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                                Tools
                              </p>
                              <div className="space-y-1">
                                {toolEntries.map(([tool, count]) => (
                                  <div
                                    key={tool}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span className="text-text-secondary">
                                      {tool}
                                    </span>
                                    <span className="text-text-primary tabular-nums font-medium">
                                      {count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {skillEntries.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                                Skills
                              </p>
                              <div className="space-y-1">
                                {skillEntries.map(([skill, count]) => (
                                  <div
                                    key={skill}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span className="text-text-secondary">
                                      {getSkillDisplayName(skill)}
                                    </span>
                                    <span className="text-text-primary tabular-nums font-medium">
                                      {count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {agentEntries.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                                Agents
                              </p>
                              <div className="space-y-1">
                                {agentEntries.map(([agent, count]) => (
                                  <div
                                    key={agent}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span className="text-text-secondary">
                                      {agent}
                                    </span>
                                    <span className="text-text-primary tabular-nums font-medium">
                                      {count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
