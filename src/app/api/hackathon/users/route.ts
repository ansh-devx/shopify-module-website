import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/apiAuth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

// GET - Fetch all users with their scores
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        scores: {
          select: {
            score: true,
          },
        },
      },
      orderBy: { email: "asc" },
    });

    // Transform to include score in user object
    const usersWithScores = users.map((user) => ({
      ...user,
      score: user.scores?.[0]?.score || 0,
    }));

    return NextResponse.json({
      success: true,
      data: usersWithScores,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PATCH - Update user role
export async function PATCH(request: NextRequest) {
  const { error, session } = await requireRole(UserRole.SUPERADMIN);
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
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

    // Prevent demoting the last superadmin
    if (user.role === UserRole.SUPERADMIN && role !== UserRole.SUPERADMIN) {
      const superadminCount = await prisma.user.count({
        where: { role: UserRole.SUPERADMIN },
      });

      if (superadminCount === 1) {
        return NextResponse.json(
          { success: false, error: "Cannot demote the last superadmin" },
          { status: 400 }
        );
      }
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
