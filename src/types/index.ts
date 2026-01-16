// User roles - matches Prisma schema
export const UserRole = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface HackathonSettings {
  questionLink: string | null;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  score?: number;
}
