import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const AWS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Generate a Storefront access token for an existing admin-token record.
 * The AWS backend reveals the row's admin token, calls Shopify, and persists
 * the storefront token on the same record. We only forward tokenId + title and
 * inject the authenticated userId server-side.
 */
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const enriched = {
    tokenId: body.tokenId,
    title: body.title,
    userId: session!.user.id || session!.user.email || "",
  };

  const idToken = await getCognitoIdToken();
  const response = await fetch(`${AWS_API_BASE_URL}/storefront-token`, {
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
