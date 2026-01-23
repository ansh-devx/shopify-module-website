"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const hasRedirected = useRef(false);

  useEffect(() => {
    // If user is authenticated and we haven't redirected yet
    if (status === "authenticated" && session?.user && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log("User authenticated, redirecting to:", callbackUrl);

      // Use router.replace for client-side navigation
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1213]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If authenticated, don't show anything (will redirect)
  if (status === "authenticated") {
    return null;
  }

  // Show login page for unauthenticated users
  return (
    <div className="min-h-screen bg-[#0d1213]">
      <AuthModal fullScreen={true} />
    </div>
  );
}
