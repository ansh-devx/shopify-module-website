import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/apiAuth";
import { UserRole } from "@/types";

const KB_API_BASE_URL = process.env.KB_API_BASE_URL || "";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { error, session } = await requireRole(UserRole.ADMIN);
  if (error) return error;

  const body = await req.json();

  const response = await fetch(`${KB_API_BASE_URL}/kb/articles/${slug}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": session!.user.id || "",
      "x-user-email": session!.user.email || "",
      "x-user-name": session!.user.name || "",
      "x-user-role": (session!.user as { role?: string }).role || "MEMBER",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
