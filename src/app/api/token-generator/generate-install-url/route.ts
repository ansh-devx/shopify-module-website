import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const AWS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const enriched = {
    ...body,
    userId: session!.user.id || session!.user.email || "",
    userName: session!.user.name || session!.user.email || "",
  };

  const idToken = await getCognitoIdToken();
  const response = await fetch(`${AWS_API_BASE_URL}/generate-install-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(enriched),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
