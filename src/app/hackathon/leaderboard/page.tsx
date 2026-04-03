"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ContentLayout from "@/components/layout/ContentLayout";
import Leaderboard from "@/components/hackathon/Leaderboard";
import HackathonFilter from "@/components/hackathon/HackathonFilter";
import AdminMenu from "@/components/hackathon/AdminMenu";
import { UserRole } from "@/types";
import Loader from "@/components/ui/Loader";

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(
    null,
  );

  const handleHackathonChange = (hackathonId: string) => {
    setSelectedHackathonId(hackathonId);
  };

  // Show loading state
  if (status === "loading") {
    return <Loader />;
  }

  // User is authenticated (middleware ensures this), show full content
  if (!session?.user) {
    return null;
  }

  // Check if user is superadmin
  const isSuperadmin = session.user.role === UserRole.SUPERADMIN;

  return (
    <>
      {isSuperadmin ? (
        <ContentLayout
          title="Hackathon Leaderboard"
          description="View rankings and scores for all hackathons"
        >
          <div className="flex items-center justify-end mb-8">
            <AdminMenu userRole={session.user.role} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Select Hackathon
              </h2>
              <HackathonFilter
                selectedHackathonId={selectedHackathonId}
                onHackathonChange={handleHackathonChange}
              />
            </div>

            {selectedHackathonId && (
              <Leaderboard hackathonId={selectedHackathonId} />
            )}

            {!selectedHackathonId && (
              <div className="text-center py-12">
                <p className="text-text-secondary">
                  Select a hackathon to view the leaderboard
                </p>
              </div>
            )}
          </div>
        </ContentLayout>
      ) : (
        /* Coming Soon Message - Only visible for non-superadmins */
        <div className="flex items-center justify-center min-h-screen bg-surface-1">
          <div className="border-2 border-accent rounded-2xl p-12 max-w-md text-center shadow-2xl">
            <div className="mb-6">
              <svg
                className="mx-auto h-20 w-20 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-accent mb-4">
              Coming Soon
            </h3>
            <p className="text-lg text-text-tertiary mb-2">
              Leaderboard access is currently restricted
            </p>
            <p className="text-sm text-text-tertiary">
              This feature will be available to all users soon
            </p>
          </div>
        </div>
      )}
    </>
  );
}
