export interface ClaudeAnalyticsUser {
  user_email: string;
  user_name: string;
  total_sessions: number;
  total_tokens: number;
  total_skill_uses: number;
  last_active: string;
  skills: Record<string, number>;
  models: Record<string, number>;
  projects: Record<string, { tokens: number; skills: number; sessions: number }>;
}

/** Normalize a raw API user object, filling in missing/optional fields with defaults */
export function normalizeUser(raw: Record<string, unknown>): ClaudeAnalyticsUser {
  return {
    user_email: (raw.user_email as string) || "",
    user_name: (raw.user_name as string) || "",
    total_sessions: (raw.total_sessions as number) || 0,
    total_tokens: (raw.total_tokens as number) || 0,
    total_skill_uses: (raw.total_skill_uses as number) || 0,
    last_active: (raw.last_active as string) || "",
    skills: (raw.skills as Record<string, number>) || {},
    models: (raw.models as Record<string, number>) || {},
    projects:
      (raw.projects as Record<string, { tokens: number; skills: number; sessions: number }>) || {},
  };
}
