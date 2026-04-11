"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

interface SectionHeaderProps {
  title: string;
  accent: string;
  description?: string;
}

export default function SectionHeader({
  title,
  accent,
  description,
}: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div className="mb-6">
        <h2 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl">
          {title}{" "}
          <span className="text-gradient italic">{accent}</span>
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-text-tertiary">{description}</p>
        )}
      </div>
    </ScrollReveal>
  );
}
