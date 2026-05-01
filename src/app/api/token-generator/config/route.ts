import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const AWS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const idToken = await getCognitoIdToken();
  const response = await fetch(`${AWS_API_BASE_URL}/config`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
