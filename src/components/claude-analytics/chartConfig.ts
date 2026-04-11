// Shared chart configuration for consistent styling across all Recharts components

export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "var(--surface-2)",
    border: "1px solid rgba(141,213,214,0.15)",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "13px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  cursor: { fill: "rgba(141,213,214,0.05)" },
};

export const CHART_GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "rgba(141,213,214,0.08)",
};

export const CHART_AXIS_TICK = {
  primary: { fill: "var(--text-secondary)", fontSize: 12 },
  secondary: { fill: "var(--text-tertiary)", fontSize: 12 },
  small: { fill: "var(--text-tertiary)", fontSize: 11 },
};

export const CHART_LABEL_STYLE = {
  fill: "var(--text-secondary)",
  fontSize: 12,
  fontFamily: "var(--font-sans)",
};

export const CHART_COLORS = {
  accent: "#8dd5d6",
  warm: "#d6b88d",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
};

export const BAR_ACTIVE_STYLE = {
  fill: "#8dd5d6",
  opacity: 0.85,
  filter: "drop-shadow(0 0 6px rgba(141,213,214,0.25))",
};

export const BAR_ACTIVE_WARM = {
  fill: "#d6b88d",
  opacity: 0.85,
  filter: "drop-shadow(0 0 6px rgba(214,184,141,0.25))",
};
