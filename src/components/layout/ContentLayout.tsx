import { ReactNode } from "react";

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
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg text-white/80">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg prose-invert max-w-none">{children}</div>
    </div>
  );
}
