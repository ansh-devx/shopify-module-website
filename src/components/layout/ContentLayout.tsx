"use client";

import { ReactNode } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function ContentLayout({
  children,
  title,
  description,
}: ContentLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <ScrollReveal>
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-normal tracking-tight text-gradient-shimmer sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-text-secondary">{description}</p>
          )}
        </div>
      </ScrollReveal>
      <div className="prose prose-lg prose-invert max-w-none">{children}</div>
    </div>
  );
}
