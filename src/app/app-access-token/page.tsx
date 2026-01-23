"use client";

import { useSession } from "next-auth/react";
import Loader from "@/components/ui/Loader";

export default function AppAccessTokenPage() {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === "loading") {
    return <Loader />;
  }

  // User is authenticated, show Coming Soon modal
  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="border-2 border-shopify-green rounded-2xl p-12 max-w-md text-center shadow-2xl">
        <div className="mb-6">
          <svg
            className="mx-auto h-20 w-20 text-shopify-green"
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
        <h3 className="text-3xl font-bold text-shopify-green mb-4">
          Coming Soon
        </h3>
        <p className="text-lg text-gray-500 mb-2">
          App Access Token feature is under development
        </p>
        <p className="text-sm text-gray-500">
          This feature will be available soon
        </p>
      </div>
    </div>
  );
}

