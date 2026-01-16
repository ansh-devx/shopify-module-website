"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { useEffect, useState } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  children,
  requiredRole,
  redirectTo = "/hackathon",
  fallback,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // Not authenticated - redirect to sign in
    if (!session) {
      router.push("/hackathon");
      return;
    }

    // Check role hierarchy
    const roleHierarchy: Record<UserRole, number> = {
      MEMBER: 1,
      ADMIN: 2,
      SUPERADMIN: 3,
    };

    const userLevel = roleHierarchy[session.user.role as UserRole];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel >= requiredLevel) {
      // User has sufficient permissions
      setIsAuthorized(true);
    } else {
      // User doesn't have sufficient permissions - redirect
      router.push(redirectTo);
    }
  }, [session, status, requiredRole, redirectTo, router]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show fallback if not authorized and fallback provided
  if (!isAuthorized) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // User is authorized - render children
  return <>{children}</>;
}
