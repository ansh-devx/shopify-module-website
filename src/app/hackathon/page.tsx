"use client";

import { useSession } from "next-auth/react";
import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AuthModal from "@/components/auth/AuthModal";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Hackathon() {
  const { data: session, status } = useSession();

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
      <LogoutButton />

      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            Welcome to the Shopify Development Hackathon! This is your
            opportunity to build innovative solutions using Shopify&apos;s
            powerful platform.
          </p>
        </section>

        {/* Event Details */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Event Details</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Coming Soon - Stay tuned for announcements!
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Virtual & In-Person options available
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What to Build */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What to Build</h2>
          <p className="mt-4 text-lg text-gray-700">Participants can build:</p>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
            <li>
              <strong>Custom Themes:</strong> Create unique storefront
              experiences
            </li>
            <li>
              <strong>Shopify Apps:</strong> Build apps that extend store
              functionality
            </li>
            <li>
              <strong>Shopify Functions:</strong> Develop custom backend logic
            </li>
            <li>
              <strong>Integrations:</strong> Connect Shopify with external
              services
            </li>
          </ul>
        </section>

        {/* Prizes */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Prizes & Recognition
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Winners will receive exciting prizes and recognition within the
            developer community. More details coming soon!
          </p>
        </section>

        {/* Registration */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">How to Register</h2>
          <p className="mt-4 text-lg text-gray-700">
            Registration details will be announced soon. Make sure you&apos;ve
            completed the learning modules to prepare for the hackathon!
          </p>
        </section>
      </div>
    </ContentLayout>
  );
}
