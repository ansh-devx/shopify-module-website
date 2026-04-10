export type SkillCategory = "Workflow" | "Standalone" | "Standards" | "Plugin";

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  Workflow: "#3b82f6",
  Standalone: "#10b981",
  Standards: "#8b5cf6",
  Plugin: "#f59e0b",
};

const SKILL_MAP: Record<string, SkillCategory> = {
  clarify: "Workflow",
  plan: "Workflow",
  execute: "Workflow",
  test: "Workflow",
  "code-review": "Workflow",
  fix: "Standalone",
  figma: "Standalone",
  compare: "Standalone",
  research: "Standalone",
  understand: "Standalone",
  "liquid-standards": "Standards",
  "section-standards": "Standards",
  "css-standards": "Standards",
  "js-standards": "Standards",
  "theme-architecture": "Standards",
};

/** Extract display name from a skill identifier (strips plugin prefix) */
export function getSkillDisplayName(skill: string): string {
  return skill.includes(":") ? skill.split(":").slice(1).join(":") : skill;
}

/** Determine the category for a skill. Plugin-prefixed skills (plugin:name) get "Plugin" category. */
export function getSkillCategory(skill: string): SkillCategory {
  if (SKILL_MAP[skill]) return SKILL_MAP[skill];
  if (skill.includes(":")) return "Plugin";
  return "Standalone";
}

export function getSkillColor(skill: string): string {
  return SKILL_CATEGORY_COLORS[getSkillCategory(skill)];
}

/** Build a category grouping from the actual skills present in the data */
export function groupSkillsByCategory(
  skills: Record<string, number>
): Record<SkillCategory, { name: string; count: number }[]> {
  const groups: Record<SkillCategory, { name: string; count: number }[]> = {
    Workflow: [],
    Standalone: [],
    Standards: [],
    Plugin: [],
  };
  for (const [name, count] of Object.entries(skills)) {
    const category = getSkillCategory(name);
    groups[category].push({ name, count });
  }
  // Sort each group by count descending
  for (const cat of Object.keys(groups) as SkillCategory[]) {
    groups[cat].sort((a, b) => b.count - a.count);
  }
  return groups;
}
