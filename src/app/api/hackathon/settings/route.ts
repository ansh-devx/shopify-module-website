import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

// GET - Fetch current hackathon settings
export async function GET() {
  try {
    const settings = await prisma.hackathonSettings.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "No active hackathon found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    console.error("Error fetching settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST - Create/Update hackathon settings
export async function POST(request: NextRequest) {
  const { error, session } = await requireRole(UserRole.ADMIN);
  if (error) return error;

  try {
    const body = await request.json();
    const { questionLink, startTime, endTime } = body;

    // Validation
    if (!questionLink || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return NextResponse.json(
        { success: false, error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Deactivate all existing hackathons
    await prisma.hackathonSettings.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new hackathon settings
    const settings = await prisma.hackathonSettings.create({
      data: {
        questionLink,
        startTime: start,
        endTime: end,
        isActive: true,
        createdById: session!.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Hackathon settings updated successfully",
      data: settings,
    });
  } catch (err) {
    console.error("Error updating settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
