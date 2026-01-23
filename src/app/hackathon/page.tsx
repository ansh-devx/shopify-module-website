"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent } from "@/components/ui/Card";
import TimerDisplay from "@/components/hackathon/TimerDisplay";
import QuestionLink from "@/components/hackathon/QuestionLink";
import AdminMenu from "@/components/hackathon/AdminMenu";
import RegisterButton from "@/components/hackathon/RegisterButton";
import { HackathonSettings } from "@/types";

export default function Hackathon() {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<HackathonSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const hasFetchedSettings = useRef(false);
  const hasFetchedRegistration = useRef(false);

  useEffect(() => {
    if (!session) return;
    if (hasFetchedSettings.current) return;
    hasFetchedSettings.current = true;

    fetchSettings();
  }, [session]);

  useEffect(() => {
    if (!settings || !session) return;
    if (hasFetchedRegistration.current) return;
    hasFetchedRegistration.current = true;

    checkRegistrationStatus();
  }, [settings, session]);

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

  const checkRegistrationStatus = async () => {
    if (!settings) return;

    try {
      const response = await fetch(
        `/api/hackathon/register?hackathonSettingsId=${settings.id}`,
      );
      const data = await response.json();
      if (data.success) {
        setIsRegistered(data.data.isRegistered);
      }
    } catch (error) {
      console.error("Failed to check registration:", error);
    }
  };

  const handleRegistrationChange = () => {
    setIsRegistered(true);
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // User is authenticated (middleware ensures this), show full content
  if (!session?.user) {
    return null;
  }

  return (
    <ContentLayout
      title="Hackathon"
      description="Join our Shopify development hackathon and showcase your skills!"
    >
      <div className="flex items-center justify-end mb-8">
        <AdminMenu userRole={session.user.role} />
      </div>

      {/* No active hackathon */}
      {!loading && !settings && (
        <div className="flex items-center justify-center min-h-100">
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
                <h3 className="mt-4 text-lg font-medium text-white">
                  No Active Hackathon
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Please register for the next hackathon when it starts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active hackathon */}
      {!loading && settings && (
        <div className="space-y-6">
          {/* Timer - visible to everyone */}
          <TimerDisplay
            startTime={new Date(settings.startTime)}
            endTime={new Date(settings.endTime)}
          />

          {/* Registration Section */}
          <RegisterButton
            hackathonId={settings.id}
            isRegistered={isRegistered}
            onRegistrationChange={handleRegistrationChange}
            endTime={new Date(settings.endTime)}
          />

          {/* Question Link - only visible to registered users */}
          {isRegistered && (
            <QuestionLink
              questionLink={settings.questionLink}
              startTime={new Date(settings.startTime)}
              endTime={new Date(settings.endTime)}
            />
          )}
        </div>
      )}
    </ContentLayout>
  );
}
