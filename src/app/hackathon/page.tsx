"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AuthModal from "@/components/auth/AuthModal";
import LogoutButton from "@/components/auth/LogoutButton";
import TimerDisplay from "@/components/hackathon/TimerDisplay";
import QuestionLink from "@/components/hackathon/QuestionLink";
import AdminMenu from "@/components/hackathon/AdminMenu";
import { UserRole, HackathonSettings } from "@/types";

export default function Hackathon() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<HackathonSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/hackathon/settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!session) {
    return (
      <>
        {/* Content in background (will be blurred by AuthModal backdrop) */}
        <div className="pointer-events-none">
          <ContentLayout
            title="Hackathon"
            description="Join our Shopify development hackathon and showcase your skills!"
          >
            <div className="space-y-8">
              <section>
                <p className="mt-4 text-lg text-gray-700">
                  Welcome to the Shopify Development Hackathon! This is your
                  opportunity to build innovative solutions using Shopify&apos;s
                  powerful platform.
                </p>
              </section>
            </div>
          </ContentLayout>
        </div>
        {/* Auth Modal */}
        <AuthModal />
      </>
    );
  }

  // Show full content if authenticated
  return (
    <ContentLayout
      title="Hackathon"
      description="Join our Shopify development hackathon and showcase your skills!"
    >
      <div className="flex items-center justify-between mb-8">
        <LogoutButton />
        <AdminMenu userRole={session.user.role} />
      </div>

      {/* No active hackathon */}
      {!loading && !settings && (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No Active Hackathon
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  There are no hackathon questions available at the moment.
                  Check back later!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active hackathon */}
      {!loading && settings && (
        <div className="space-y-6">
          <TimerDisplay
            startTime={new Date(settings.startTime)}
            endTime={new Date(settings.endTime)}
          />
          <QuestionLink
            questionLink={settings.questionLink}
            startTime={new Date(settings.startTime)}
            endTime={new Date(settings.endTime)}
          />
        </div>
      )}
    </ContentLayout>
  );
}
