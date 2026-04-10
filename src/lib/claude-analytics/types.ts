export interface SessionDetail {
  name: string;
  started_at: string;
  tokens: number;
  messages: number;
  models: string[];
  skills: Record<string, number>;
  agents: Record<string, number>;
  tools: Record<string, number>;
}

export interface ProjectData {
  tokens: number;
  skills: number;
  sessions: number;
  session_details: Record<string, SessionDetail>;
}

export interface ClaudeAnalyticsUser {
  user_email: string;
  user_name: string;
  total_sessions: number;
  total_tokens: number;
  total_skill_uses: number;
  last_active: string;
  skills: Record<string, number>;
  models: Record<string, number>;
  projects: Record<string, ProjectData>;

  // New fields
  message_count: number;
  total_tool_uses: number;
  tools: Record<string, number>;
  agents: Record<string, number>;

  // Per-session flat maps
  session_tokens: Record<string, number>;
  session_messages: Record<string, number>;
  session_models: Record<string, string[]>;
  session_skills: Record<string, Record<string, number>>;
  session_agents: Record<string, Record<string, number>>;
  session_tools: Record<string, Record<string, number>>;
}

/** Normalize a raw API user object, filling in missing/optional fields with defaults */
export function normalizeUser(raw: Record<string, unknown>): ClaudeAnalyticsUser {
  // Normalize projects to ensure session_details exists on each entry
  const rawProjects = (raw.projects as Record<string, Record<string, unknown>>) || {};
  const projects: Record<string, ProjectData> = {};
  for (const [name, data] of Object.entries(rawProjects)) {
    projects[name] = {
      tokens: (data.tokens as number) || 0,
      skills: (data.skills as number) || 0,
      sessions: (data.sessions as number) || 0,
      session_details: (data.session_details as Record<string, SessionDetail>) || {},
    };
  }

  return {
    user_email: (raw.user_email as string) || "",
    user_name: (raw.user_name as string) || "",
    total_sessions: (raw.total_sessions as number) || 0,
    total_tokens: (raw.total_tokens as number) || 0,
    total_skill_uses: (raw.total_skill_uses as number) || 0,
    last_active: (raw.last_active as string) || "",
    skills: (raw.skills as Record<string, number>) || {},
    models: (raw.models as Record<string, number>) || {},
    projects,
    message_count: (raw.message_count as number) || 0,
    total_tool_uses: (raw.total_tool_uses as number) || 0,
    tools: (raw.tools as Record<string, number>) || {},
    agents: (raw.agents as Record<string, number>) || {},
    session_tokens: (raw.session_tokens as Record<string, number>) || {},
    session_messages: (raw.session_messages as Record<string, number>) || {},
    session_models: (raw.session_models as Record<string, string[]>) || {},
    session_skills: (raw.session_skills as Record<string, Record<string, number>>) || {},
    session_agents: (raw.session_agents as Record<string, Record<string, number>>) || {},
    session_tools: (raw.session_tools as Record<string, Record<string, number>>) || {},
  };
}
