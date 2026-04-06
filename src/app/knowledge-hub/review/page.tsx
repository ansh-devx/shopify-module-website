import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReviewQueue from "@/components/knowledge-hub/ReviewQueue";

export default function ReviewQueuePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/knowledge-hub"
        className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Knowledge Hub
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight mb-2">
          Review Queue
        </h1>
        <p className="text-text-secondary">
          Articles assigned to you for review and approval.
        </p>
      </div>

      <ReviewQueue />
    </div>
  );
}
