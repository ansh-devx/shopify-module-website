// User roles - matches Prisma schema
export const UserRole = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface HackathonSettings {
  id: string;
  hackathonNumber: number;
  questionLink: string | null;
  startTime: string;
  endTime: string;
  isActive?: boolean;
  createdAt?: string;
  createdById?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  score?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  isCurrentUser: boolean;
  isRegistered: boolean;
}

export interface HackathonRegistration {
  userId: string;
  hackathonSettingsId: string;
  score: number;
  registeredAt: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data?: LeaderboardEntry[];
  error?: string;
  currentUserRank?: number;
  totalParticipants?: number;
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    userId: string;
    hackathonSettingsId: string;
    score: number;
  };
}
