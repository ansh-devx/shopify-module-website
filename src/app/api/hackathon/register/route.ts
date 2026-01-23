import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";

// POST - Register user for a hackathon
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { hackathonSettingsId } = body;

    if (!hackathonSettingsId) {
      return NextResponse.json(
        { success: false, error: "Hackathon ID is required" },
        { status: 400 }
      );
    }

    // Check if hackathon exists
    const hackathon = await prisma.hackathonSettings.findUnique({
      where: { id: hackathonSettingsId },
    });

    if (!hackathon) {
      return NextResponse.json(
        { success: false, error: "Hackathon not found" },
        { status: 404 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.score.findUnique({
      where: {
        userId_hackathonSettingsId: {
          userId: session!.user.id,
          hackathonSettingsId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: "Already registered for this hackathon" },
        { status: 400 }
      );
    }

    // Create registration (score entry with score = 0)
    const registration = await prisma.score.create({
      data: {
        userId: session!.user.id,
        userName: session!.user.name || "Unknown",
        userEmail: session!.user.email || "",
        hackathonSettingsId,
        score: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully registered for hackathon",
      data: {
        userId: registration.userId,
        hackathonSettingsId: registration.hackathonSettingsId,
        score: registration.score,
      },
    });
  } catch (err: any) {
    console.error("Error registering for hackathon:", err);
    
    // Handle unique constraint violation
    if (err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Already registered for this hackathon" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to register for hackathon" },
      { status: 500 }
    );
  }
}

// GET - Check if user is registered for a hackathon
export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const hackathonSettingsId = searchParams.get("hackathonSettingsId");

    if (!hackathonSettingsId) {
      return NextResponse.json(
        { success: false, error: "Hackathon ID is required" },
        { status: 400 }
      );
    }

    const registration = await prisma.score.findUnique({
      where: {
        userId_hackathonSettingsId: {
          userId: session!.user.id,
          hackathonSettingsId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        isRegistered: !!registration,
        score: registration?.score || 0,
      },
    });
  } catch (err) {
    console.error("Error checking registration:", err);
    return NextResponse.json(
      { success: false, error: "Failed to check registration status" },
      { status: 500 }
    );
  }
}

