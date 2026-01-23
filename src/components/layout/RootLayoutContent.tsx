"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ScrollToTop from "@/components/ScrollToTop";
import SearchProvider from "@/components/search/SearchProvider";

export default function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname === "/login";

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1213]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If on login page, render without Header/Sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other pages, render with Header/Sidebar
  // The middleware already handles authentication, so we don't need to check here
  return (
    <SearchProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="ml-72 flex-1 bg-[#0d1213] text-white">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
