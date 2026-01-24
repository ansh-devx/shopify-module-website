import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";

// GET - Fetch leaderboard for a hackathon
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(request.url);
    let hackathonSettingsId = searchParams.get("hackathonSettingsId");

    // If no hackathon ID provided, get the active one
    if (!hackathonSettingsId) {
      const activeHackathon = await prisma.hackathonSettings.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });

      if (!activeHackathon) {
        return NextResponse.json(
          { success: false, error: "No active hackathon found" },
          { status: 404 },
        );
      }

      hackathonSettingsId = activeHackathon.id;
    }

    // Fetch all scores for this hackathon with user role information
    const scores = await prisma.score.findMany({
      where: {
        hackathonSettingsId,
      },
      orderBy: [{ score: "desc" }, { userName: "asc" }],
      select: {
        userId: true,
        userName: true,
        userEmail: true,
        score: true,
        user: {
          select: {
            role: true,
          },
        },
      },
    });

    // Filter out admins/superadmins with 0 score (they only created the question)
    const filteredScores = scores.filter((entry) => {
      const isAdmin =
        entry.user.role === "ADMIN" || entry.user.role === "SUPERADMIN";
      const hasZeroScore = entry.score === 0;
      // Exclude admins with 0 score from the leaderboard
      return !(isAdmin && hasZeroScore);
    });

    // Calculate ranks and format response
    let currentRank = 1;
    let previousScore = -1;
    let sameRankCount = 0;

    const leaderboard = filteredScores.map((entry, index) => {
      // Handle tied scores
      if (entry.score !== previousScore) {
        currentRank = index + 1;
        sameRankCount = 0;
      } else {
        sameRankCount++;
      }
      previousScore = entry.score;

      const isAdmin =
        entry.user.role === "ADMIN" || entry.user.role === "SUPERADMIN";
      const hasZeroScore = entry.score === 0;

      return {
        rank: currentRank,
        userId: entry.userId,
        userName: entry.userName,
        userEmail: entry.userEmail,
        score: entry.score,
        isCurrentUser: session?.user?.id === entry.userId,
        isRegistered: true,
        userRole: entry.user.role,
        isAdminWithZeroScore: isAdmin && hasZeroScore,
      };
    });

    // Find current user's rank
    const currentUserEntry = leaderboard.find(
      (entry) => entry.userId === session?.user?.id,
    );

    return NextResponse.json({
      success: true,
      data: leaderboard,
      currentUserRank: currentUserEntry?.rank,
      totalParticipants: leaderboard.length,
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
