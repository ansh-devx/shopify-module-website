import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const AWS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 }
    );
  }

  const idToken = await getCognitoIdToken();
  const response = await fetch(
    `${AWS_API_BASE_URL}/token?code=${encodeURIComponent(code)}`,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
