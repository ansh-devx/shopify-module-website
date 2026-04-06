import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import MyDocuments from "@/components/knowledge-hub/MyDocuments";

export default function MyDocumentsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/knowledge-hub"
        className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Knowledge Hub
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight mb-2">
            My Documents
          </h1>
          <p className="text-text-secondary">
            Track and manage all your submitted articles.
          </p>
        </div>
        <Link
          href="/knowledge-hub/contribute"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-background hover:bg-accent-hover transition-colors shadow-[0_0_20px_rgba(141,213,214,0.15)]"
        >
          <PenLine className="h-4 w-4" />
          New Article
        </Link>
      </div>

      <MyDocuments />
    </div>
  );
}
