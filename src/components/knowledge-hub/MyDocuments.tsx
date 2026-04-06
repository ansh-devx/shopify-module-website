"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PenLine,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  slug: string;
  title: string;
  brandProject: string;
  tags: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string;
  assignedApproverName: string;
  date: string;
  createdAt: number;
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  APPROVED: {
    label: "Published",
    icon: CheckCircle2,
    className: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

export default function MyDocuments() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/knowledge-hub/articles/mine")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/knowledge-hub/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="rounded-full bg-surface-2 p-5">
          <FileText className="h-8 w-8 text-text-tertiary" />
        </div>
        <div>
          <p className="text-text-primary font-medium mb-1">No articles yet</p>
          <p className="text-text-secondary text-sm">Share your knowledge with the team.</p>
        </div>
        <Link
          href="/knowledge-hub/contribute"
          className="mt-2 flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background hover:bg-accent-hover transition-colors"
        >
          Write your first article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => {
        const status = STATUS_CONFIG[article.status];
        const StatusIcon = status.icon;

        return (
          <div
            key={article.id}
            className="rounded-2xl border border-accent/10 bg-surface-2 p-5 hover:border-accent/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Status badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      status.className,
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                  {article.brandProject && (
                    <span className="text-xs text-text-tertiary bg-surface-3 rounded-full px-2.5 py-0.5">
                      {article.brandProject}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-medium text-text-primary text-base truncate mb-1">
                  {article.status === "APPROVED" ? (
                    <Link
                      href={`/knowledge-hub/article/${article.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {article.title}
                    </Link>
                  ) : (
                    article.title
                  )}
                </h3>

                {/* Meta */}
                <p className="text-xs text-text-tertiary mb-1">
                  Assigned to: {article.assignedApproverName || "—"} · {article.date}
                </p>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-text-tertiary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rejection reason */}
                {article.status === "REJECTED" && article.rejectionReason && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/15 bg-red-500/5 px-3 py-2.5">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{article.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {article.status !== "APPROVED" && (
                  <button
                    onClick={() =>
                      router.push(`/knowledge-hub/contribute?editId=${article.id}`)
                    }
                    className="flex items-center gap-1.5 rounded-xl border border-accent/15 bg-surface-3 px-3 py-1.5 text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-colors cursor-pointer"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(article.id)}
                  disabled={deletingId === article.id}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/15 bg-surface-3 px-3 py-1.5 text-xs text-red-400/70 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deletingId === article.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
