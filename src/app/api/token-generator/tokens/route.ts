import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const AWS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = session!.user.id || session!.user.email || "";
  const limit = req.nextUrl.searchParams.get("limit") ?? "10";
  const page = req.nextUrl.searchParams.get("page") ?? "1";

  const params = new URLSearchParams({ userId, limit, page });
  const idToken = await getCognitoIdToken();
  const response = await fetch(
    `${AWS_API_BASE_URL}/tokens?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
