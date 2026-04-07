export type SkillCategory = "Workflow" | "Standalone" | "Standards";

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  Workflow: "#3b82f6",
  Standalone: "#10b981",
  Standards: "#8b5cf6",
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

export function getSkillCategory(skill: string): SkillCategory {
  return SKILL_MAP[skill] || "Standalone";
}

export function getSkillColor(skill: string): string {
  return SKILL_CATEGORY_COLORS[getSkillCategory(skill)];
}

export const ALL_SKILLS = Object.keys(SKILL_MAP);

export const SKILLS_BY_CATEGORY: Record<SkillCategory, string[]> = {
  Workflow: ["clarify", "plan", "execute", "test", "code-review"],
  Standalone: ["fix", "figma", "compare", "research", "understand"],
  Standards: [
    "liquid-standards",
    "section-standards",
    "css-standards",
    "js-standards",
    "theme-architecture",
  ],
};
