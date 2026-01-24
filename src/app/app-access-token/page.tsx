"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import Loader from "@/components/ui/Loader";
import AuthModal from "@/components/auth/AuthModal";
import Modal from "@/components/ui/Modal";
import TokensTable from "@/components/app-access-token/TokensTable";
import AppAccessTokenWizard from "@/components/app-access-token/AppAccessTokenWizard";
import { UserRole } from "@/types";

export default function AppAccessTokenPage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TODO: Replace with actual API call to fetch tokens
  const tokens: any[] = [];

  // Show loading state
  if (status === "loading") {
    return <Loader />;
  }

  // Show auth modal if not authenticated
  if (!session?.user) {
    return (
      <>
        {/* Blurred background */}
        <div className="pointer-events-none">
          <div className="min-h-screen bg-[#0d1213]" />
        </div>
        {/* Auth Modal */}
        <AuthModal fullScreen={true} />
      </>
    );
  }

  // Check if user is superadmin
  const isSuperadmin = session.user.role === UserRole.SUPERADMIN;

  // Handle successful token creation
  const handleTokenCreated = () => {
    setIsModalOpen(false);
    // TODO: Refresh tokens list from API
  };

  return (
    <>
      {isSuperadmin ? (
        // Show the table and modal for superadmin users
        <div className="min-h-screen bg-[#0d1213] p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  App Access Tokens
                </h1>
                <p className="mt-2 text-white/60">
                  Manage your Shopify app access tokens for API integration
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-shopify-green px-6 py-3 font-semibold text-white transition-all hover:bg-shopify-green/90 hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create New Token
              </button>
            </div>

            {/* Tokens Table */}
            <TokensTable
              tokens={tokens}
              // TODO: Implement edit and delete handlers
              // onEdit={(token) => console.log("Edit", token)}
              // onDelete={(token) => console.log("Delete", token)}
            />

            {/* Create Token Modal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Create App Access Token"
              size="lg"
            >
              <AppAccessTokenWizard onSuccess={handleTokenCreated} />
            </Modal>
          </div>
        </div>
      ) : (
        /* Coming Soon Message - Only visible for non-superadmins */
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
              App Access Token management is currently restricted
            </p>
            <p className="text-sm text-gray-500">
              This feature will be available to all users soon
            </p>
          </div>
        </div>
      )}
    </>
  );
}
