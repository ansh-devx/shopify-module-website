import { ClaudeAnalyticsUser, SessionDetail } from "./types";
import { ProjectRow } from "@/components/claude-analytics/ProjectsTable";

type AggregateField = "skills" | "models" | "tools" | "agents";

export function aggregateField(
  users: ClaudeAnalyticsUser[],
  field: AggregateField
): Record<string, number> {
  const result: Record<string, number> = {};
  users.forEach((u) => {
    Object.entries(u[field]).forEach(([key, count]) => {
      result[key] = (result[key] || 0) + count;
    });
  });
  return result;
}

export function aggregateProjects(
  users: ClaudeAnalyticsUser[]
): ProjectRow[] {
  const projectMap: Record<
    string,
    { tokens: number; skills: number; sessions: number; userSet: Set<string> }
  > = {};

  users.forEach((u) => {
    Object.entries(u.projects).forEach(([name, data]) => {
      if (!projectMap[name]) {
        projectMap[name] = {
          tokens: 0,
          skills: 0,
          sessions: 0,
          userSet: new Set(),
        };
      }
      projectMap[name].tokens += data.tokens;
      projectMap[name].skills += data.skills;
      projectMap[name].sessions += data.sessions;
      projectMap[name].userSet.add(u.user_email);
    });
  });

  return Object.entries(projectMap).map(
    ([name, { tokens, skills, sessions, userSet }]): ProjectRow => ({
      name,
      tokens,
      skills,
      sessions,
      activeUsers: userSet.size,
    })
  );
}

export function computeInsights(users: ClaudeAnalyticsUser[]) {
  if (users.length === 0) return null;

  const totalSessions = users.reduce((s, u) => s + u.total_sessions, 0);
  const totalTokens = users.reduce((s, u) => s + u.total_tokens, 0);
  const totalMessages = users.reduce((s, u) => s + u.message_count, 0);

  const mostActiveUser = [...users].sort(
    (a, b) => b.total_tokens - a.total_tokens
  )[0];

  const avgTokensPerSession =
    totalSessions > 0 ? Math.round(totalTokens / totalSessions) : 0;

  const avgMessagesPerSession =
    totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;

  // Aggregate all skills to find top skill
  const allSkills: Record<string, number> = {};
  users.forEach((u) => {
    Object.entries(u.skills).forEach(([skill, count]) => {
      allSkills[skill] = (allSkills[skill] || 0) + count;
    });
  });
  const topSkill = Object.entries(allSkills).sort(
    ([, a], [, b]) => b - a
  )[0];

  // Aggregate models to find top model
  const allModels: Record<string, number> = {};
  users.forEach((u) => {
    Object.entries(u.models).forEach(([model, count]) => {
      allModels[model] = (allModels[model] || 0) + count;
    });
  });
  const topModel = Object.entries(allModels).sort(
    ([, a], [, b]) => b - a
  )[0];

  return {
    mostActiveUser: mostActiveUser.user_name,
    avgTokensPerSession,
    avgMessagesPerSession,
    topSkill: topSkill ? topSkill[0] : null,
    topSkillCount: topSkill ? topSkill[1] : 0,
    topModel: topModel ? topModel[0].replace("claude-", "") : null,
    topModelSessions: topModel ? topModel[1] : 0,
    avgSessionsPerUser:
      users.length > 0 ? Math.round(totalSessions / users.length) : 0,
  };
}

// ── Time-series helpers ─────────────────────────────────────

function toDateKey(d: Date): string | null {
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

/** Collect all sessions across all users into a flat array */
function collectAllSessions(
  users: ClaudeAnalyticsUser[]
): (SessionDetail & { user_email: string })[] {
  const sessions: (SessionDetail & { user_email: string })[] = [];
  users.forEach((u) => {
    Object.values(u.projects).forEach((proj) => {
      Object.values(proj.session_details).forEach((s) => {
        if (s.started_at) {
          sessions.push({ ...s, user_email: u.user_email });
        }
      });
    });
  });
  return sessions;
}

export interface DailyDataPoint {
  date: string; // "YYYY-MM-DD"
  sessions: number;
  tokens: number;
  messages: number;
}

/**
 * Aggregate session data into daily buckets.
 * Returns an array sorted by date, one entry per day that had activity.
 */
export function aggregateDailyActivity(
  users: ClaudeAnalyticsUser[]
): DailyDataPoint[] {
  const sessions = collectAllSessions(users);
  const buckets: Record<string, { sessions: number; tokens: number; messages: number }> = {};

  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.started_at));
    if (!key) return;
    if (!buckets[key]) {
      buckets[key] = { sessions: 0, tokens: 0, messages: 0 };
    }
    buckets[key].sessions += 1;
    buckets[key].tokens += s.tokens || 0;
    buckets[key].messages += s.messages || 0;
  });

  return Object.entries(buckets)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface HeatmapDay {
  date: string; // "YYYY-MM-DD"
  count: number;
}

/**
 * Build heatmap data for the past N days.
 * Returns exactly `days` entries (including zero-activity days).
 */
export function buildHeatmapData(
  users: ClaudeAnalyticsUser[],
  days = 90
): HeatmapDay[] {
  const sessions = collectAllSessions(users);
  const counts: Record<string, number> = {};

  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.started_at));
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  const result: HeatmapDay[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    if (!key) continue;
    result.push({ date: key, count: counts[key] || 0 });
  }
  return result;
}

/**
 * Build sparkline data: last N days of a given metric summed from all users' sessions.
 */
export function buildSparkline(
  users: ClaudeAnalyticsUser[],
  metric: "sessions" | "tokens" | "messages",
  days = 14
): number[] {
  const sessions = collectAllSessions(users);
  const buckets: Record<string, number> = {};

  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.started_at));
    if (!key) return;
    if (!buckets[key]) buckets[key] = 0;
    if (metric === "sessions") buckets[key] += 1;
    else if (metric === "tokens") buckets[key] += s.tokens || 0;
    else buckets[key] += s.messages || 0;
  });

  const result: number[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    result.push(key ? buckets[key] || 0 : 0);
  }
  return result;
}
