import { UserRole } from "@/types";

export const roleHierarchy: Record<UserRole, number> = {
  MEMBER: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

export function hasAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessAdminPanel(role: UserRole): boolean {
  return hasAccess(role, UserRole.ADMIN);
}

export function canAccessSuperadminPanel(role: UserRole): boolean {
  return hasAccess(role, UserRole.SUPERADMIN);
}

export function canUpdateScores(role: UserRole): boolean {
  return role === UserRole.SUPERADMIN;
}

export function canUpdateRoles(role: UserRole): boolean {
  return role === UserRole.SUPERADMIN;
}
