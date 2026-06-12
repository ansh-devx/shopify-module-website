import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { canAccessClaudeAnalytics } from "@/lib/claude-analytics/access";
import { prisma } from "@/lib/prisma";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const KB_API_BASE_URL = process.env.KB_API_BASE_URL || "";

function getEmailVariants(email: string): string[] {
  const variants = [email];
  if (email.endsWith("@devxconsultancy.com")) {
    variants.push(email.replace("@devxconsultancy.com", "@devxlabs.ai"));
  } else if (email.endsWith("@devxlabs.ai")) {
    variants.push(email.replace("@devxlabs.ai", "@devxconsultancy.com"));
  }
  return variants;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ user_email: string }> }
) {
  const { error, session } = await requireAuth();
  if (error) return error;
  if (!canAccessClaudeAnalytics(session!.user.role, session!.user.email)) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions" },
      { status: 403 }
    );
  }

  const { user_email: encodedId } = await params;
  let email: string;
  try {
    email = Buffer.from(encodedId, "base64").toString("utf-8");
  } catch {
    email = encodedId;
  }

  const idToken = await getCognitoIdToken();
  const response = await fetch(
    `${KB_API_BASE_URL}/analytics/users/${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "x-user-id": session!.user.id || "",
        "x-user-email": session!.user.email || "",
        "x-user-name": session!.user.name || "",
        "x-user-role": (session!.user as { role?: string }).role || "MEMBER",
      },
    }
  );

  const data = await response.json();
  if (!data?.user) {
    return NextResponse.json(data, { status: response.status });
  }

  // Enrich with display name from Prisma
  const userEmail = (data.user.user_email || email).toLowerCase();
  const variants = getEmailVariants(userEmail);
  const dbUser = await prisma.user.findFirst({
    where: { email: { in: variants } },
    select: { name: true },
  });

  return NextResponse.json(
    {
      user: {
        ...data.user,
        user_name: dbUser?.name || data.user.user_name || userEmail,
      },
    },
    { status: response.status }
  );
}
