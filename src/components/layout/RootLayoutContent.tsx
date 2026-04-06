"use client";

import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    return <>{children}</>;
  }

  return (
    <SearchProvider>
      <ScrollToTop />
      <div className="relative flex min-h-screen flex-col bg-background">
        {/* Ambient background orbs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/[0.07] blur-[120px] animate-pulse-glow" />
          <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-accent/[0.04] blur-[100px] animate-pulse-glow [animation-delay:2s]" />
          <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-accent-warm/[0.03] blur-[80px] animate-float-slow" />
        </div>
        {/* Grid background */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-50" />

        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="lg:ml-72 flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </SearchProvider>
  );
}
