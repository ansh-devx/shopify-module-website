"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/code-block/CodeBlock";

interface Article {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  date: string;
  content: string;
  brandProject?: string;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/knowledge-hub/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data.article || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
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

  if (!article) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Article not found</p>
        <Link
          href="/knowledge-hub"
          className="text-accent hover:text-accent-hover underline underline-offset-2"
        >
          Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Back link */}
      <Link
        href="/knowledge-hub"
        className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Knowledge Hub
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight mb-4">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-accent-warm" />
            <span>{article.author}</span>
          </div>
          {article.brandProject && (
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-surface-3 px-2.5 py-0.5 text-xs text-text-secondary">
                {article.brandProject}
              </span>
            </div>
          )}
          {article.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-text-tertiary" />
              <span>{article.date}</span>
            </div>
          )}
          {article.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-text-tertiary" />
              <div className="flex gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-3 px-2.5 py-0.5 text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-accent/10 mb-8" />

      {/* Content */}
      <div className="article-content text-[15px] leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-semibold text-text-primary mt-8 mb-3 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-text-primary mt-7 mb-2.5">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium text-text-primary mt-5 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-medium text-text-primary mt-4 mb-1.5">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-text-primary/90 mb-3">{children}</p>
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
              <ul className="list-disc pl-5 mb-3 space-y-1 text-text-primary/90 marker:text-accent/40">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-3 space-y-1 text-text-primary/90">
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
              const language =
                className.replace("language-", "") || "text";
              const codeString = String(
                codeElement?.props?.children ?? "",
              ).replace(/\n$/, "");

              return (
                <div className="my-4">
                  <CodeBlock
                    code={codeString}
                    language={language}
                    showLineNumbers={codeString.split("\n").length > 3}
                  />
                </div>
              );
            },
            code: ({ children }) => (
              <code className="rounded bg-surface-3 px-1.5 py-0.5 text-sm font-mono text-accent">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-accent/30 pl-4 my-3 text-text-secondary italic">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 rounded-lg border border-accent/10">
                <table className="min-w-full text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-surface-3 text-text-secondary">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 text-left font-medium">{children}</th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 border-t border-accent/5 text-text-primary/80">
                {children}
              </td>
            ),
            hr: () => <hr className="my-6 border-accent/10" />,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
