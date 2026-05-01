import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/apiAuth";
import { getCognitoIdToken } from "@/lib/cognitoAuth";

const KB_API_BASE_URL = process.env.KB_API_BASE_URL || "";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await getAuthSession();
  const idToken = await getCognitoIdToken();

  const response = await fetch(`${KB_API_BASE_URL}/kb/articles/${slug}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
      "x-user-id": session?.user?.id || "",
      "x-user-email": session?.user?.email || "",
      "x-user-name": session?.user?.name || "",
      "x-user-role": (session?.user as { role?: string })?.role || "MEMBER",
    },
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const idToken = await getCognitoIdToken();

  const response = await fetch(`${KB_API_BASE_URL}/kb/articles/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      "x-user-id": session.user.id || "",
      "x-user-email": session.user.email || "",
      "x-user-name": session.user.name || "",
      "x-user-role": (session.user as { role?: string }).role || "MEMBER",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idToken = await getCognitoIdToken();

  const response = await fetch(`${KB_API_BASE_URL}/kb/articles/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "x-user-id": session.user.id || "",
      "x-user-email": session.user.email || "",
      "x-user-name": session.user.name || "",
      "x-user-role": (session.user as { role?: string }).role || "MEMBER",
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
