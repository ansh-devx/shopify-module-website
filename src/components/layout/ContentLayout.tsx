"use client";

import { ReactNode, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  previousPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

export default function ContentLayout({
  children,
  title,
  description,
  previousPage,
  nextPage,
}: ContentLayoutProps) {
  const hasBottomNav = Boolean(previousPage || nextPage);

  // Reserve space for the fixed bottom nav so it doesn't overlap the footer.
  useEffect(() => {
    if (!hasBottomNav) return;
    document.body.dataset.hasBottomNav = "true";
    return () => {
      delete document.body.dataset.hasBottomNav;
    };
  }, [hasBottomNav]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 pb-28 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg text-gray-600">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">{children}</div>

      {/* Course-style Navigation (fixed bottom bar) */}
      {hasBottomNav && (
        <div
          data-bottom-nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <div className="flex-1">
              {previousPage && (
                <Button variant="outline" asChild>
                  <Link
                    href={previousPage.href}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500">Previous</div>
                      <div className="font-medium">{previousPage.title}</div>
                    </div>
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex-1 text-right">
              {nextPage && (
                <Button variant="outline" asChild>
                  <Link
                    href={nextPage.href}
                    className="flex items-center gap-2 justify-end"
                  >
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Next</div>
                      <div className="font-medium">{nextPage.title}</div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
