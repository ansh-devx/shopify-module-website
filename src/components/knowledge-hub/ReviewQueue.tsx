"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, FileText, User, Calendar, Tag, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  slug: string;
  title: string;
  authorName: string;
  authorEmail: string;
  brandProject: string;
  tags: string[];
  date: string;
  status: string;
}

export default function ReviewQueue() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetch("/api/knowledge-hub/review")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/knowledge-hub/articles/${id}/approve`, { method: "POST" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/knowledge-hub/articles/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setRejectingId(null);
        setRejectReason("");
      }
    } finally {
      setActionId(null);
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
          <p className="text-text-primary font-medium mb-1">All caught up</p>
          <p className="text-text-secondary text-sm">No articles pending your review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className="rounded-2xl border border-accent/10 bg-surface-2 p-5 hover:border-accent/20 transition-colors"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary text-base mb-2">
                {article.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {article.authorName}
                </span>
                {article.brandProject && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {article.brandProject}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {article.date}
                </span>
              </div>
              {article.tags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Tag className="h-3 w-3 text-text-tertiary" />
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-text-tertiary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Read article link */}
            <Link
              href={`/knowledge-hub/article/${article.slug}`}
              target="_blank"
              className="shrink-0 text-xs text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
            >
              Read article
            </Link>
          </div>

          {/* Reject reason input (shown when rejecting) */}
          {rejectingId === article.id && (
            <div className="mb-4">
              <label className="block text-xs text-text-secondary mb-1.5">
                Rejection reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain what needs to be improved..."
                rows={3}
                className="w-full rounded-xl border border-red-500/20 bg-surface-3 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-red-500/40 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {rejectingId === article.id ? (
              <>
                <button
                  onClick={() => handleReject(article.id)}
                  disabled={!rejectReason.trim() || actionId === article.id}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors cursor-pointer",
                    !rejectReason.trim() || actionId === article.id
                      ? "bg-surface-3 text-text-tertiary cursor-not-allowed"
                      : "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25",
                  )}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  {actionId === article.id ? "Rejecting..." : "Confirm Reject"}
                </button>
                <button
                  onClick={() => { setRejectingId(null); setRejectReason(""); }}
                  className="text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleApprove(article.id)}
                  disabled={actionId === article.id}
                  className="flex items-center gap-1.5 rounded-xl bg-green-400/15 border border-green-400/30 px-4 py-2 text-xs font-medium text-green-400 hover:bg-green-400/25 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {actionId === article.id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => { setRejectingId(article.id); setRejectReason(""); }}
                  disabled={actionId === article.id}
                  className="flex items-center gap-1.5 rounded-xl bg-surface-3 border border-accent/10 px-4 py-2 text-xs font-medium text-text-secondary hover:text-red-400 hover:border-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
