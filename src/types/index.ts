// User roles enum - duplicated here to avoid importing from @prisma/client in client components
export enum UserRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

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

