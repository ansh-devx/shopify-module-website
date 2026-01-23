import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth/apiAuth";
import { UserRole } from "@/types";

// GET - Fetch hackathons (filtered by user role)
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(request.url);
    const filterByCreator = searchParams.get("filterByCreator") === "true";

    let hackathons;

    // If filterByCreator is true and user is an admin (not superadmin), only show their hackathons
    if (filterByCreator && session?.user) {
      const isSuperadmin = session.user.role === UserRole.SUPERADMIN;

      if (isSuperadmin) {
        // Superadmin sees all hackathons
        hackathons = await prisma.hackathonSettings.findMany({
          orderBy: { hackathonNumber: "asc" },
          select: {
            id: true,
            hackathonNumber: true,
            questionLink: true,
            startTime: true,
            endTime: true,
            isActive: true,
            createdAt: true,
            createdById: true,
          },
        });
      } else {
        // Admin sees only their created hackathons
        hackathons = await prisma.hackathonSettings.findMany({
          where: { createdById: session.user.id },
          orderBy: { hackathonNumber: "asc" },
          select: {
            id: true,
            hackathonNumber: true,
            questionLink: true,
            startTime: true,
            endTime: true,
            isActive: true,
            createdAt: true,
            createdById: true,
          },
        });
      }
    } else {
      // Default: show all hackathons (for leaderboard, etc.)
      hackathons = await prisma.hackathonSettings.findMany({
        orderBy: { hackathonNumber: "asc" },
        select: {
          id: true,
          hackathonNumber: true,
          questionLink: true,
          startTime: true,
          endTime: true,
          isActive: true,
          createdAt: true,
          createdById: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: hackathons,
    });
  } catch (err) {
    console.error("Error fetching hackathons:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hackathons" },
      { status: 500 },
    );
  }
}
