import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const KB_API_BASE_URL = process.env.KB_API_BASE_URL || "";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;

  const idToken = await getCognitoIdToken();
  const response = await fetch(`${KB_API_BASE_URL}/kb/articles/mine`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "x-user-id": session!.user.id || "",
      "x-user-email": session!.user.email || "",
      "x-user-name": session!.user.name || "",
      "x-user-role": (session!.user as { role?: string }).role || "MEMBER",
    },
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
