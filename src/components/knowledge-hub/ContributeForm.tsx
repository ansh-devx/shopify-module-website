"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function ContributeForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Auto-fill author from session
  useEffect(() => {
    if (session?.user?.name && !author) {
      setAuthor(session.user.name);
    }
  }, [session, author]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!author.trim()) {
      setError("Author name is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/knowledge-hub/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, tags, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("Article published! Redirecting...");
      setTimeout(() => {
        router.push(`/knowledge-hub/article/${data.slug}`);
      }, 1500);
    } catch {
      setError("Failed to publish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <Link
        href="/knowledge-hub"
        className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Knowledge Hub
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight mb-2">
          Contribute to Knowledge Base
        </h1>
        <p className="text-text-secondary">
          Share your learnings, approaches, and implementations with the team.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Implementing Custom Checkout for Brand X"
            className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Author + Tags row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tags
              <span className="text-text-tertiary font-normal ml-1">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., checkout, liquid, shopify plus"
              className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-secondary">
              Content
              <span className="text-text-tertiary font-normal ml-1">
                (Markdown supported)
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent transition-colors cursor-pointer"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </>
              )}
            </button>
          </div>

          {showPreview ? (
            <div className="min-h-[400px] rounded-xl border border-accent/10 bg-surface-2 px-5 py-4">
              {content.trim() ? (
                <MarkdownPreview content={content} />
              ) : (
                <p className="text-text-tertiary text-sm italic">
                  Nothing to preview yet...
                </p>
              )}
            </div>
          ) : (
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`# Your Article Title

## Overview
What problem does this solve? Brief context.

## The Approach
How did you implement it? Technical details, architecture decisions.

## Code Examples
\`\`\`liquid
{{ product.title }}
\`\`\`

## Key Learnings
- What worked well
- What to watch out for
- Tips for the team`}
              rows={20}
              className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary font-mono placeholder:text-text-tertiary/60 focus:border-accent/30 focus:outline-none transition-colors resize-y"
            />
          )}
        </div>

        {/* Error / Success */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-text-tertiary">
            Article will be immediately available in the Knowledge Hub.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
              submitting || !title.trim() || !content.trim()
                ? "bg-surface-3 text-text-tertiary cursor-not-allowed"
                : "bg-accent text-background hover:bg-accent-hover shadow-[0_0_20px_rgba(141,213,214,0.15)] hover:shadow-[0_0_25px_rgba(141,213,214,0.25)]",
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publish Article
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold text-text-primary mt-6 mb-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-text-primary mt-5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-text-primary mt-4 mb-1.5">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-text-primary/90 mb-2">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-accent">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-accent-warm italic">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent-hover"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2 space-y-0.5 text-text-primary/90 marker:text-accent/40">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2 space-y-0.5 text-text-primary/90">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          pre: ({ children }) => {
            const codeElement = children as React.ReactElement<{
              className?: string;
              children?: React.ReactNode;
            }>;
            const className = codeElement?.props?.className || "";
            const language = className.replace("language-", "") || "text";
            const codeString = String(
              codeElement?.props?.children ?? "",
            ).replace(/\n$/, "");

            return (
              <div className="my-3">
                <CodeBlock
                  code={codeString}
                  language={language}
                  showLineNumbers={codeString.split("\n").length > 3}
                />
              </div>
            );
          },
          code: ({ children }) => (
            <code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs font-mono text-accent">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent/30 pl-3 my-2 text-text-secondary italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded-lg border border-accent/10">
              <table className="min-w-full text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-3 text-text-secondary">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-1.5 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 border-t border-accent/5 text-text-primary/80">
              {children}
            </td>
          ),
          hr: () => <hr className="my-4 border-accent/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
