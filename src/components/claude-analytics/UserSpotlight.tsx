"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ClaudeAnalyticsUser } from "@/lib/claude-analytics/types";
import { formatTokens } from "@/lib/claude-analytics/formatTokens";
import { Trophy, Activity, Coins, MessageSquare, ExternalLink } from "lucide-react";

interface UserSpotlightProps {
  users: ClaudeAnalyticsUser[];
}

const RANK_STYLES = [
  {
    gradient: "from-yellow-500/20 via-yellow-400/10 to-transparent",
    border: "border-yellow-500/25 hover:border-yellow-400/40",
    badge: "bg-yellow-500/15 text-yellow-400",
    glow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.08)]",
    icon: "text-yellow-400",
    label: "1st",
  },
  {
    gradient: "from-gray-400/15 via-gray-400/5 to-transparent",
    border: "border-gray-400/20 hover:border-gray-400/35",
    badge: "bg-gray-400/15 text-gray-400",
    glow: "hover:shadow-[0_0_25px_rgba(156,163,175,0.06)]",
    icon: "text-gray-400",
    label: "2nd",
  },
  {
    gradient: "from-orange-600/15 via-orange-600/5 to-transparent",
    border: "border-orange-600/20 hover:border-orange-500/35",
    badge: "bg-orange-600/15 text-orange-400",
    glow: "hover:shadow-[0_0_25px_rgba(234,88,12,0.06)]",
    icon: "text-orange-400",
    label: "3rd",
  },
];

export default function UserSpotlight({ users }: UserSpotlightProps) {
  const router = useRouter();

  const topUsers = [...users]
    .sort((a, b) => b.total_tokens - a.total_tokens)
    .slice(0, 3);

  if (topUsers.length === 0) return null;

  const maxTokens = topUsers[0]?.total_tokens || 1;

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {topUsers.map((user, i) => {
        const style = RANK_STYLES[i];
        const tokenPercent = ((user.total_tokens / maxTokens) * 100).toFixed(0);
        return (
          <Card
            key={user.user_email}
            className={`group relative overflow-hidden cursor-pointer transition-all duration-500 ${style.border} ${style.glow}`}
            onClick={() =>
              router.push(
                `/claude-analytics/users/${btoa(user.user_email)}`
              )
            }
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none`}
            />

            <div className="relative">
              {/* Header: rank + avatar + name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">
                        {getInitials(user.user_name)}
                      </span>
                    </div>
                    {/* Rank badge */}
                    <div
                      className={`absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full ${style.badge} flex items-center justify-center`}
                    >
                      <span className="text-[9px] font-bold">
                        {style.label}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {user.user_name}
                    </p>
                    <p className="text-xs text-text-tertiary truncate">
                      {user.user_email}
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3.5 w-3.5 text-text-tertiary" />
                </div>
              </div>

              {/* Token bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    <Coins className="h-3 w-3" /> Tokens
                  </span>
                  <span className="text-xs font-medium text-text-primary tabular-nums">
                    {formatTokens(user.total_tokens)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${tokenPercent}%`,
                      background: `linear-gradient(90deg, rgba(141,213,214,0.5), rgba(141,213,214,0.8))`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center py-1.5 rounded-lg bg-surface-2/50">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Activity className="h-3 w-3 text-text-tertiary" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary tabular-nums">
                    {user.total_sessions.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-text-tertiary">Sessions</p>
                </div>
                <div className="text-center py-1.5 rounded-lg bg-surface-2/50">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <MessageSquare className="h-3 w-3 text-text-tertiary" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary tabular-nums">
                    {user.message_count.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-text-tertiary">Messages</p>
                </div>
                <div className="text-center py-1.5 rounded-lg bg-surface-2/50">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Trophy className={`h-3 w-3 ${style.icon}`} />
                  </div>
                  <p className="text-sm font-semibold text-text-primary tabular-nums">
                    {user.total_skill_uses.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-text-tertiary">Skills</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
