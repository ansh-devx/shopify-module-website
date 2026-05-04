import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/apiAuth";
import { UserRole } from "@/types";
import { prisma } from "@/lib/prisma";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const KB_API_BASE_URL = process.env.KB_API_BASE_URL || "";

/** Map devxconsultancy.com ↔ devxlabs.ai so either domain finds the Prisma user */
function getEmailVariants(email: string): string[] {
  const variants = [email];
  if (email.endsWith("@devxconsultancy.com")) {
    variants.push(email.replace("@devxconsultancy.com", "@devxlabs.ai"));
  } else if (email.endsWith("@devxlabs.ai")) {
    variants.push(email.replace("@devxlabs.ai", "@devxconsultancy.com"));
  }
  return variants;
}

export async function GET() {
  const { error, session } = await requireRole(UserRole.SUPERADMIN);
  if (error) return error;

  const idToken = await getCognitoIdToken();
  const response = await fetch(`${KB_API_BASE_URL}/analytics/users`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "x-user-id": session!.user.id || "",
      "x-user-email": session!.user.email || "",
      "x-user-name": session!.user.name || "",
      "x-user-role": (session!.user as { role?: string }).role || "MEMBER",
    },
  });

  const data = await response.json();
  const analyticsUsers = Array.isArray(data) ? data : data?.users ?? [];

  // Fetch all platform users for name lookup
  const dbUsers = await prisma.user.findMany({
    select: { email: true, name: true },
  });
  const nameByEmail = new Map<string, string>();
  for (const u of dbUsers) {
    if (u.email && u.name) {
      nameByEmail.set(u.email.toLowerCase(), u.name);
    }
  }

  // Enrich analytics users with display names from Prisma
  const enriched = analyticsUsers.map(
    (user: { user_email?: string; user_name?: string }) => {
      const email = (user.user_email || "").toLowerCase();
      const variants = getEmailVariants(email);
      const displayName = variants
        .map((v) => nameByEmail.get(v))
        .find((n) => !!n);
      return {
        ...user,
        user_name: displayName || user.user_name || email,
      };
    }
  );

  return NextResponse.json({ users: enriched }, { status: response.status });
}
