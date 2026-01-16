import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/types";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function requireAuth() {
  const session = await getAuthSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}

export async function requireRole(requiredRole: UserRole) {
  const { error, session } = await requireAuth();

  if (error) return { error, session: null };

  const roleHierarchy: Record<UserRole, number> = {
    MEMBER: 1,
    ADMIN: 2,
    SUPERADMIN: 3,
  };

  const userLevel = roleHierarchy[session!.user.role as UserRole];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel < requiredLevel) {
    return {
      error: NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}
