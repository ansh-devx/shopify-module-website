"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // If user is authenticated, redirect using window.location
    if (status === "authenticated" && session?.user) {
      console.log("User authenticated, redirecting to:", callbackUrl);
      window.location.replace(callbackUrl);
    }
  }, [status, session, callbackUrl]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1213]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Always show login page - let the redirect happen in the background
  return (
    <div className="min-h-screen bg-[#0d1213]">
      <AuthModal fullScreen={true} />
    </div>
  );
}
