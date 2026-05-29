import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const AWS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// GET /api/token-generator/storefront-token/reveal?tokenId=... -> full storefront token
export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const tokenId = req.nextUrl.searchParams.get("tokenId");
  if (!tokenId) {
    return NextResponse.json(
      { error: "Missing tokenId parameter" },
      { status: 400 },
    );
  }

  const userId = session!.user.id || session!.user.email || "";

  const params = new URLSearchParams({ userId, tokenId });
  const idToken = await getCognitoIdToken();
  const response = await fetch(
    `${AWS_API_BASE_URL}/storefront-token/reveal?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${idToken}` },
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
