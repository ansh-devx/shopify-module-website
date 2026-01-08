import { ReactNode } from "react";
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
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
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
      <div className="prose prose-lg max-w-none">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-8">
        <div className="flex-1">
          {previousPage && (
            <Button variant="outline" asChild>
              <Link href={previousPage.href} className="flex items-center gap-2">
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
              <Link href={nextPage.href} className="flex items-center gap-2">
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
  );
}

