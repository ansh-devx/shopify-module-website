"use client";

import { useState, useMemo, Fragment } from "react";
import { Card } from "@/components/ui/Card";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { SessionDetail } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { formatRelativeTime } from "@/lib/claude-analytics/formatTime";
import { getSkillDisplayName } from "@/lib/claude-analytics/skillCategories";
import EmptyState from "./EmptyState";

interface SessionsTableProps {
  sessions: Record<string, SessionDetail>;
  projectName?: string;
}

const PAGE_SIZE = 10;

export default function SessionsTable({
  sessions,
  projectName,
}: SessionsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(
    () =>
      Object.entries(sessions).sort(([, a], [, b]) => {
        const at = new Date(a.started_at).getTime();
        const bt = new Date(b.started_at).getTime();
        return (Number.isNaN(bt) ? 0 : bt) - (Number.isNaN(at) ? 0 : at);
      }),
    [sessions]
  );

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (sorted.length === 0) {
    return (
      <Card className="p-0 overflow-hidden">
        {projectName && (
          <div className="px-5 py-3 border-b border-accent/10">
            <h4 className="text-sm font-semibold text-text-primary">
              {projectName}
            </h4>
          </div>
        )}
        <EmptyState
          icon={Activity}
          title="No sessions"
          description="No session data available for this project."
        />
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
            {paginated.map(([id, session]) => {
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
                      hasDetails && setExpandedId(isExpanded ? null : id)
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
                      <td colSpan={6} className="p-0">
                        <div className="border-l-2 border-accent/30 ml-6 pl-6 pr-6 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {toolEntries.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2.5">
                                  Tools
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {toolEntries.map(([tool, count]) => (
                                    <span
                                      key={tool}
                                      className="inline-flex items-center gap-1 rounded-full bg-accent/8 px-2.5 py-1 text-xs"
                                    >
                                      <span className="text-text-secondary">
                                        {tool}
                                      </span>
                                      <span className="text-text-tertiary font-medium">
                                        {count}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {skillEntries.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2.5">
                                  Skills
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {skillEntries.map(([skill, count]) => (
                                    <span
                                      key={skill}
                                      className="inline-flex items-center gap-1 rounded-full bg-accent-warm/8 px-2.5 py-1 text-xs"
                                    >
                                      <span className="text-text-secondary">
                                        {getSkillDisplayName(skill)}
                                      </span>
                                      <span className="text-text-tertiary font-medium">
                                        {count}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {agentEntries.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2.5">
                                  Agents
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {agentEntries.map(([agent, count]) => (
                                    <span
                                      key={agent}
                                      className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-2.5 py-1 text-xs"
                                    >
                                      <span className="text-text-secondary">
                                        {agent}
                                      </span>
                                      <span className="text-text-tertiary font-medium">
                                        {count}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
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
