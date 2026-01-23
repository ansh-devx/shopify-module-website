"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // If user is already authenticated, redirect to callback URL or home
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
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

  // If authenticated, show loading while redirecting
  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1213]">
        <div className="text-white text-lg">Redirecting...</div>
      </div>
    );
  }

  // Show login page for unauthenticated users
  return (
    <div className="min-h-screen bg-[#0d1213]">
      <AuthModal fullScreen={true} />
    </div>
  );
}
