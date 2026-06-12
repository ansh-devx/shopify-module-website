// Emails granted Claude Analytics access without the SUPERADMIN role
export const CLAUDE_ANALYTICS_ALLOWED_EMAILS = ["akshar.patel@devxlabs.ai"];

export function canAccessClaudeAnalytics(
  role?: string | null,
  email?: string | null
): boolean {
  if (role === "SUPERADMIN") return true;
  return (
    !!email && CLAUDE_ANALYTICS_ALLOWED_EMAILS.includes(email.toLowerCase())
  );
}
