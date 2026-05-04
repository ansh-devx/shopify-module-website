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

const UNKNOWN_DATE_KEY = "unknown";

function toDateKey(d: Date): string {
  if (Number.isNaN(d.getTime())) return UNKNOWN_DATE_KEY;
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

/** Collect all sessions across all users into a flat array — does not drop any. */
function collectAllSessions(
  users: ClaudeAnalyticsUser[]
): (SessionDetail & { user_email: string })[] {
  const sessions: (SessionDetail & { user_email: string })[] = [];
  users.forEach((u) => {
    Object.values(u.projects).forEach((proj) => {
      Object.values(proj.session_details).forEach((s) => {
        sessions.push({ ...s, user_email: u.user_email });
      });
    });
  });
  return sessions;
}

export interface DailyDataPoint {
  date: string; // "YYYY-MM-DD" or "unknown"
  sessions: number;
  tokens: number;
  messages: number;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Aggregate session data into daily buckets, zero-filling every day between
 * the earliest dated session and today. Sessions with unparseable dates are
 * collected into a final "unknown" bucket instead of being dropped.
 */
export interface DailyActivityResult {
  daily: DailyDataPoint[];
  unknown: { sessions: number; tokens: number; messages: number };
}

export function aggregateDailyActivity(
  users: ClaudeAnalyticsUser[]
): DailyActivityResult {
  const sessions = collectAllSessions(users);
  const buckets: Record<string, { sessions: number; tokens: number; messages: number }> = {};

  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.started_at));
    if (!buckets[key]) {
      buckets[key] = { sessions: 0, tokens: 0, messages: 0 };
    }
    buckets[key].sessions += 1;
    buckets[key].tokens += s.tokens || 0;
    buckets[key].messages += s.messages || 0;
  });

  const datedKeys = Object.keys(buckets).filter((k) => k !== UNKNOWN_DATE_KEY);
  const daily: DailyDataPoint[] = [];

  if (datedKeys.length > 0) {
    datedKeys.sort();
    const start = new Date(datedKeys[0] + "T00:00:00Z");
    const end = new Date();
    for (let d = start; d <= end; d = addDays(d, 1)) {
      const key = toDateKey(d);
      const data = buckets[key] || { sessions: 0, tokens: 0, messages: 0 };
      daily.push({ date: key, ...data });
    }
  }

  return {
    daily,
    unknown: buckets[UNKNOWN_DATE_KEY] || { sessions: 0, tokens: 0, messages: 0 },
  };
}

export interface HeatmapDay {
  date: string; // "YYYY-MM-DD"
  count: number;
}

/**
 * Build heatmap data spanning every day from the earliest dated session
 * through today. If `minDays` is supplied, the window is at least that wide,
 * even when the data is sparser. Sessions with unparseable dates are counted
 * into the returned `unknownCount` rather than discarded.
 */
export function buildHeatmapData(
  users: ClaudeAnalyticsUser[],
  minDays = 90
): { days: HeatmapDay[]; unknownCount: number } {
  const sessions = collectAllSessions(users);
  const counts: Record<string, number> = {};

  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.started_at));
    counts[key] = (counts[key] || 0) + 1;
  });

  const datedKeys = Object.keys(counts).filter((k) => k !== UNKNOWN_DATE_KEY);
  const now = new Date();
  let start: Date;

  if (datedKeys.length > 0) {
    datedKeys.sort();
    const earliest = new Date(datedKeys[0] + "T00:00:00Z");
    const minStart = addDays(now, -(minDays - 1));
    start = earliest < minStart ? earliest : minStart;
  } else {
    start = addDays(now, -(minDays - 1));
  }

  const days: HeatmapDay[] = [];
  for (let d = start; d <= now; d = addDays(d, 1)) {
    const key = toDateKey(d);
    days.push({ date: key, count: counts[key] || 0 });
  }

  return { days, unknownCount: counts[UNKNOWN_DATE_KEY] || 0 };
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
  let unknownContribution = 0;

  sessions.forEach((s) => {
    const key = toDateKey(new Date(s.started_at));
    const value =
      metric === "sessions" ? 1 : metric === "tokens" ? s.tokens || 0 : s.messages || 0;
    if (key === UNKNOWN_DATE_KEY) {
      unknownContribution += value;
      return;
    }
    buckets[key] = (buckets[key] || 0) + value;
  });

  const result: number[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const key = toDateKey(addDays(now, -i));
    result.push(buckets[key] || 0);
  }
  // Fold unknown-date contribution into the most recent bucket so it isn't lost.
  if (unknownContribution > 0 && result.length > 0) {
    result[result.length - 1] += unknownContribution;
  }
  return result;
}
