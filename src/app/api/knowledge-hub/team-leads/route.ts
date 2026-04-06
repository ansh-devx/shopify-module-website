import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const teamLeads = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPERADMIN"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ teamLeads });
}
