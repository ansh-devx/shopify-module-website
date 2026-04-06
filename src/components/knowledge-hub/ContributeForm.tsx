"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Send,
  Loader2,
  CheckCircle2,
  Upload,
  X,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/code-block/CodeBlock";

interface TeamLead {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function ContributeForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = !!editId;
  const userRole = (session?.user as { role?: string })?.role || "MEMBER";
  const isSuperAdmin = userRole === "SUPERADMIN";

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [brandProject, setBrandProject] = useState("");
  const [content, setContent] = useState("");
  const [assignedApproverEmail, setAssignedApproverEmail] = useState("");
  const [assignedApproverName, setAssignedApproverName] = useState("");
  const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);

  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoExtractedTitleRef = useRef<string>("");
  const titleRef = useRef(title);
  titleRef.current = title;

  // Auto-fill author from session
  useEffect(() => {
    if (session?.user?.name && !author) {
      setAuthor(session.user.name);
    }
  }, [session, author]);

  // Fetch team leads for dropdown
  useEffect(() => {
    fetch("/api/knowledge-hub/team-leads")
      .then((r) => r.json())
      .then((data) => setTeamLeads(data.teamLeads || []))
      .catch(() => {});
  }, []);

  // Live frontmatter + H1 extraction for Title and Tags
  useEffect(() => {
    const normalized = content.replace(/\r\n/g, "\n");

    // Try frontmatter first
    if (normalized.startsWith("---\n")) {
      const closingIdx = normalized.indexOf("\n---", 4);
      if (closingIdx !== -1) {
        const fmLines = normalized.slice(4, closingIdx).split("\n");
        let extractedTitle = "";
        let extractedTags = "";
        for (const line of fmLines) {
          const colonIdx = line.indexOf(":");
          if (colonIdx === -1) continue;
          const key = line.slice(0, colonIdx).trim();
          const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (key === "title") extractedTitle = val;
          if (key === "tags") extractedTags = val.replace(/^\[|\]$/g, "").trim();
        }
        if (extractedTitle && (!titleRef.current || titleRef.current === autoExtractedTitleRef.current)) {
          setTitle(extractedTitle);
          autoExtractedTitleRef.current = extractedTitle;
        }
        if (extractedTags) setTags(extractedTags);
        return;
      }
    }

    // Fallback: extract title from first # H1
    const h1Match = normalized.match(/^#\s+(.+)$/m);
    const extracted = h1Match ? h1Match[1].trim() : "";
    if (extracted && (!titleRef.current || titleRef.current === autoExtractedTitleRef.current)) {
      setTitle(extracted);
      autoExtractedTitleRef.current = extracted;
    }
  }, [content]);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!editId) return;
    fetch(`/api/knowledge-hub/articles/${editId}`)
      .then((r) => r.json())
      .then((data) => {
        const a = data.article;
        if (a) {
          setTitle(a.title || "");
          setAuthor(a.authorName || a.author || "");
          setTags(Array.isArray(a.tags) ? a.tags.join(", ") : a.tags || "");
          setBrandProject(a.brandProject || "");
          setContent(a.content || "");
          setAssignedApproverEmail(a.assignedApproverEmail || "");
          setAssignedApproverName(a.assignedApproverName || "");
        }
        setLoadingArticle(false);
      })
      .catch(() => setLoadingArticle(false));
  }, [editId]);

  const handleApproverSelect = (email: string) => {
    setAssignedApproverEmail(email);
    const lead = teamLeads.find((l) => l.email === email);
    setAssignedApproverName(lead?.name || email);
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith(".md")) {
      setError("Only .md files are supported");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

      // Parse frontmatter if present
      if (normalized.startsWith("---\n")) {
        const closingIdx = normalized.indexOf("\n---", 4);
        if (closingIdx !== -1) {
          const fmLines = normalized.slice(4, closingIdx).split("\n");
          const parsed: Record<string, string> = {};
          let i = 0;
          while (i < fmLines.length) {
            const colonIdx = fmLines[i].indexOf(":");
            if (colonIdx !== -1) {
              const key = fmLines[i].slice(0, colonIdx).trim();
              const val = fmLines[i].slice(colonIdx + 1).trim();
              if (val) {
                parsed[key] = val.replace(/^["']|["']$/g, "");
              } else {
                // Block list: collect following "- item" lines
                const items: string[] = [];
                i++;
                while (i < fmLines.length && /^\s*-\s/.test(fmLines[i])) {
                  items.push(fmLines[i].replace(/^\s*-\s+/, "").trim());
                  i++;
                }
                if (items.length > 0) parsed[key] = items.join(", ");
                continue;
              }
            }
            i++;
          }

          if (parsed.title) {
            setTitle(parsed.title);
            autoExtractedTitleRef.current = parsed.title;
          }
          if (parsed.tags) {
            setTags(parsed.tags.replace(/^\[|\]$/g, "").trim());
          }
        }
      }

      // Strip frontmatter from displayed content
      const stripped = normalized.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
      setContent(stripped);
      setError("");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!title.trim()) { setError("Title is required"); return; }
    if (!author.trim()) { setError("Author name is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }
    if (!isSuperAdmin && !assignedApproverEmail.trim()) { setError("Please select an approver"); return; }

    setSubmitting(true);

    try {
      const url = isEditMode
        ? `/api/knowledge-hub/articles/${editId}`
        : "/api/knowledge-hub/articles";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          tags,
          brandProject,
          content,
          assignedApproverEmail,
          assignedApproverName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(
        isSuperAdmin
          ? "Article published!"
          : isEditMode
          ? "Article resubmitted for review!"
          : "Article submitted for review!",
      );
      setTimeout(() => {
        if (isSuperAdmin && data.slug) {
          router.push(`/knowledge-hub/article/${data.slug}`);
        } else {
          router.push("/knowledge-hub/my-documents");
        }
      }, 1500);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <Link
        href={isEditMode ? "/knowledge-hub/my-documents" : "/knowledge-hub"}
        className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {isEditMode ? "Back to My Documents" : "Back to Knowledge Hub"}
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight mb-2">
          {isEditMode ? "Edit Article" : "Contribute to Knowledge Base"}
        </h1>
        <p className="text-text-secondary">
          {isEditMode
            ? "Update your article and resubmit for review."
            : "Share your learnings, approaches, and implementations with the team."}
        </p>
      </div>

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

        {/* Author + Brand/Project */}
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
              Brand / Project
              <span className="text-text-tertiary font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={brandProject}
              onChange={(e) => setBrandProject(e.target.value)}
              placeholder="e.g., Bombay Shirt Company"
              className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tags + Approver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Tags
              <span className="text-text-tertiary font-normal ml-1">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., checkout, liquid, shopify plus"
              className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:outline-none transition-colors"
            />
          </div>
          {!isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Assign Approver
              </label>
              {(() => {
                // ADMIN articles need SUPERADMIN approval; MEMBER articles can go to any ADMIN+
                const eligibleApprovers = userRole === "ADMIN"
                  ? teamLeads.filter((l) => l.role === "SUPERADMIN")
                  : teamLeads;
                return eligibleApprovers.length > 0 ? (
                  <select
                    value={assignedApproverEmail}
                    onChange={(e) => handleApproverSelect(e.target.value)}
                    className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary focus:border-accent/30 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select an approver...</option>
                    {eligibleApprovers.map((lead) => (
                      <option key={lead.id} value={lead.email}>
                        {lead.name || lead.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="email"
                    value={assignedApproverEmail}
                    onChange={(e) => {
                      setAssignedApproverEmail(e.target.value);
                      setAssignedApproverName(e.target.value);
                    }}
                    placeholder="approver@devxlabs.ai"
                    className="w-full rounded-xl border border-accent/10 bg-surface-2 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/30 focus:outline-none transition-colors"
                  />
                );
              })()}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-secondary">
              Content
              <span className="text-text-tertiary font-normal ml-1">(Markdown)</span>
            </label>
            <div className="flex items-center gap-3">
              {/* Upload .md file */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload .md
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {/* Preview toggle */}
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent transition-colors cursor-pointer"
              >
                {showPreview ? (
                  <><EyeOff className="h-3.5 w-3.5" />Edit</>
                ) : (
                  <><Eye className="h-3.5 w-3.5" />Preview</>
                )}
              </button>
            </div>
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
            <div
              className={cn(
                "relative rounded-xl border transition-colors",
                dragOver ? "border-accent/40 bg-accent/5" : "border-accent/10",
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {dragOver && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-accent/5 z-10 pointer-events-none">
                  <p className="text-accent text-sm font-medium">Drop your .md file here</p>
                </div>
              )}
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`# Your Article Title\n\n## Overview\nWhat problem does this solve?\n\n## The Approach\nHow did you implement it?\n\n## Code Examples\n\`\`\`liquid\n{{ product.title }}\n\`\`\`\n\n## Key Learnings\n- What worked well\n- What to watch out for`}
                rows={20}
                className="w-full rounded-xl bg-surface-2 px-4 py-3 text-sm text-text-primary font-mono placeholder:text-text-tertiary/60 focus:outline-none resize-y"
              />
            </div>
          )}
        </div>

        {/* Error / Success */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <X className="h-4 w-4 shrink-0" />
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
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Clock className="h-3.5 w-3.5" />
            {isSuperAdmin
              ? "Your article will be published immediately."
              : "Article goes to your assigned approver for review before publishing."}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim() || (!isSuperAdmin && !assignedApproverEmail.trim())}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
              submitting || !title.trim() || !content.trim() || (!isSuperAdmin && !assignedApproverEmail.trim())
                ? "bg-surface-3 text-text-tertiary cursor-not-allowed"
                : "bg-accent text-background hover:bg-accent-hover shadow-[0_0_20px_rgba(141,213,214,0.15)] hover:shadow-[0_0_25px_rgba(141,213,214,0.25)]",
            )}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
            ) : (
              <><Send className="h-4 w-4" />{isEditMode ? "Resubmit" : "Submit for Review"}</>
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
            <h1 className="text-xl font-semibold text-text-primary mt-6 mb-2 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-text-primary mt-5 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-text-primary mt-4 mb-1.5">{children}</h3>
          ),
          p: ({ children }) => <p className="text-text-primary/90 mb-2">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-accent">{children}</strong>,
          em: ({ children }) => <em className="text-accent-warm italic">{children}</em>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent-hover">
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2 space-y-0.5 text-text-primary/90 marker:text-accent/40">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2 space-y-0.5 text-text-primary/90">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          pre: ({ children }) => {
            const codeElement = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
            const className = codeElement?.props?.className || "";
            const language = className.replace("language-", "") || "text";
            const codeString = String(codeElement?.props?.children ?? "").replace(/\n$/, "");
            return (
              <div className="my-3">
                <CodeBlock code={codeString} language={language} showLineNumbers={codeString.split("\n").length > 3} />
              </div>
            );
          },
          code: ({ children }) => (
            <code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs font-mono text-accent">{children}</code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent/30 pl-3 my-2 text-text-secondary italic">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded-lg border border-accent/10">
              <table className="min-w-full text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-surface-3 text-text-secondary">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-1.5 text-left font-medium">{children}</th>,
          td: ({ children }) => <td className="px-3 py-1.5 border-t border-accent/5 text-text-primary/80">{children}</td>,
          hr: () => <hr className="my-4 border-accent/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
