"use client";

import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ScrollToTop from "@/components/ScrollToTop";
import SearchProvider from "@/components/search/SearchProvider";
import Loader from "@/components/ui/Loader";

export default function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  // Show loading state while checking authentication
  if (status === "loading") {
    return <Loader />;
  }

  // If not authenticated, render without Header/Sidebar (auth modal will be shown by page)
  if (!session) {
    return <>{children}</>;
  }

  // For authenticated users, render with Header/Sidebar
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
