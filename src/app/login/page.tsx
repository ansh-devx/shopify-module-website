"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [status, session, router]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show login page only if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0d1213]">
        <AuthModal fullScreen={true} />
      </div>
    );
  }

  return null;
}
