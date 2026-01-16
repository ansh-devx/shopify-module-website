import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

// GET - Fetch all scores
export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { score: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: scores,
    });
  } catch (err) {
    console.error("Error fetching scores:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}

// PATCH - Update user score
export async function PATCH(request: NextRequest) {
  const { error, session } = await requireRole(UserRole.SUPERADMIN);
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, score } = body;

    if (!userId || score === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { success: false, error: "Score must be a non-negative number" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update or create score
    const updatedScore = await prisma.score.upsert({
      where: { userId },
      update: { score },
      create: {
        userId,
        userName: user.name || "Unknown",
        userEmail: user.email || "",
        score,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Score updated successfully",
      data: updatedScore,
    });
  } catch (err) {
    console.error("Error updating score:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update score" },
      { status: 500 }
    );
  }
}
