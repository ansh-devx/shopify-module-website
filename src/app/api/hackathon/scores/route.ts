import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

// GET - Fetch all scores (optionally filtered by hackathon)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonSettingsId = searchParams.get("hackathonSettingsId");

    const scores = await prisma.score.findMany({
      where: hackathonSettingsId ? { hackathonSettingsId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        hackathonSettings: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            isActive: true,
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
      { status: 500 },
    );
  }
}

// PATCH - Update user score
export async function PATCH(request: NextRequest) {
  const { error, session } = await requireRole(UserRole.ADMIN);
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, score, hackathonSettingsId } = body;

    if (!userId || score === undefined || !hackathonSettingsId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (userId, score, hackathonSettingsId)",
        },
        { status: 400 },
      );
    }

    if (typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { success: false, error: "Score must be a non-negative number" },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check if hackathon exists and get creator info
    const hackathon = await prisma.hackathonSettings.findUnique({
      where: { id: hackathonSettingsId },
      select: {
        id: true,
        createdById: true,
      },
    });

    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: "Hackathon not found" },
        { status: 404 },
      );
    }

    // Check if user is either the creator of the hackathon OR a superadmin
    const isSuperadmin = session!.user.role === UserRole.SUPERADMIN;
    const isCreator = hackathon.createdById === session!.user.id;

    if (!isSuperadmin && !isCreator) {
      return NextResponse.json(
        {
          success: false,
          error: "You can only manage scores for hackathons you created",
        },
        { status: 403 },
      );
    }

    // Check if user is registered for this hackathon
    const existingScore = await prisma.score.findUnique({
      where: {
        userId_hackathonSettingsId: {
          userId,
          hackathonSettingsId,
        },
      },
    });

    if (!existingScore) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User is not registered for this hackathon. They must register first.",
        },
        { status: 400 },
      );
    }

    // Update score for registered user
    const updatedScore = await prisma.score.update({
      where: {
        userId_hackathonSettingsId: {
          userId,
          hackathonSettingsId,
        },
      },
      data: {
        score,
        updatedById: session!.user.id,
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
      { status: 500 },
    );
  }
}
