"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  Square,
  Bot,
  User,
  FileText,
  ExternalLink,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/code-block/CodeBlock";
import MagneticButton from "../ui/MagneticButton";

interface SourceArticle {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  date: string;
}

const GREETINGS = [
  "Welcome back",
  "Good to see you",
  "Hey there",
  "Hello",
  "Hi there",
  "Great to have you here",
  "Glad you're here",
  "What's on your mind",
  "Ready to learn something new",
  "Let's get started",
  "What can we explore today",
  "How's it going",
  "What are you curious about",
  "What would you like to know",
  "Let's dive in",
  "What's on the agenda today",
  "Looking for something specific",
  "What would you like to explore",
  "Here to help",
  "Ask me anything",
  "What's cooking",
  "What brings you here today",
  "Got a question in mind",
  "Let's figure it out together",
  "What are we learning today",
];

function getGreeting() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const greeting = useRef(getGreeting());

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/knowledge-hub/chat",
      }),
    [],
  );

  const { messages, sendMessage, setMessages, status, stop } = useChat({
    transport,
  });

  const [input, setInput] = useState("");
  const [sources, setSources] = useState<SourceArticle[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;
  const isLoading = status === "submitted" || status === "streaming";
  const isDone = status === "ready" && hasMessages;

  // Parse source slugs from AI response when done
  useEffect(() => {
    if (!isDone) return;
    const assistantMsg = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!assistantMsg) return;

    const text = assistantMsg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

    const match = text.match(/<!--\s*sources:\s*(.+?)\s*-->/);
    if (match) {
      const slugs = match[1].split(",").map((s) => s.trim());
      // Fetch article metadata for matched slugs
      Promise.all(
        slugs.map((slug) =>
          fetch(`/api/knowledge-hub/articles/${slug}`)
            .then((res) => res.json())
            .then((data) =>
              data.article
                ? {
                    slug: data.article.slug,
                    title: data.article.title,
                    author: data.article.author,
                    tags: data.article.tags,
                    date: data.article.date,
                  }
                : null,
            )
            .catch(() => null),
        ),
      ).then((results) => {
        setSources(results.filter((r): r is SourceArticle => r !== null));
      });
    }
  }, [isDone, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sources]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    setSources([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    // Clear previous messages — each query is independent
    setMessages([]);
    await sendMessage({ text });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const contributeButton = (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      <Link
        href="/knowledge-hub/my-documents"
        className="rounded-full border border-accent/15 bg-surface-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:border-accent/30 transition-colors"
      >
        My Docs
      </Link>
      <MagneticButton
        variant="secondary"
        as="a"
        href="/knowledge-hub/contribute"
        className="py-2"
      >
        Contribute
      </MagneticButton>
    </div>
  );

  // Welcome state — greeting + centered input
  if (!hasMessages) {
    return (
      <div className="relative flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        {contributeButton}
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full bg-surface-2 border border-accent/10 px-4 py-2">
          <Image
            src="/devx-icon.jpeg"
            alt="devx"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-sm text-text-secondary font-medium">
            devx labs
          </span>
        </div>

        {/* Greeting */}
        <h1 className="font-serif text-5xl sm:text-6xl font-normal text-text-primary/90 tracking-tight text-center mb-12">
          {greeting.current}, {firstName}!
        </h1>

        {/* Input */}
        <div className="w-full max-w-2xl">
          <div
            className="rounded-2xl border border-text-tertiary/20 bg-surface-2/50 p-1 transition-colors focus-within:border-text-tertiary/40 cursor-text"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button") === null) {
                textareaRef.current?.focus();
              }
            }}
          >
            <div className="px-4 pt-3 pb-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can I help you today?"
                rows={1}
                className="w-full resize-none bg-transparent text-base text-text-primary placeholder:text-text-tertiary focus:outline-none"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end px-3 pb-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                  input.trim()
                    ? "bg-accent text-background hover:bg-accent-hover"
                    : "text-text-tertiary/40",
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversation state
  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">
      {contributeButton}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/15 mt-0.5">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
              )}

              <div
                className={cn(
                  "rounded-2xl px-4 py-2",
                  message.role === "user"
                    ? "max-w-[75%] bg-surface-3 text-text-primary"
                    : "max-w-[90%]",
                )}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return message.role === "assistant" ? (
                      <MarkdownContent
                        key={i}
                        content={part.text.replace(
                          /<!--\s*sources:.*?-->/g,
                          "",
                        )}
                      />
                    ) : (
                      <p
                        key={i}
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                      >
                        {part.text}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-warm/10 border border-accent-warm/15 mt-0.5">
                  <User className="h-4 w-4 text-accent-warm" />
                </div>
              )}
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/15">
                <Bot className="h-4 w-4 text-accent" />
              </div>
              <div className="rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                  Thinking...
                </div>
              </div>
            </div>
          )}

          {/* Source Articles — shown after AI finishes */}
          {isDone && sources.length > 0 && (
            <div className="ml-11">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
                Sources
              </p>
              <div className="flex flex-col gap-2">
                {sources.map((source) => (
                  <Link
                    key={source.slug}
                    href={`/knowledge-hub/article/${source.slug}`}
                    target="_blank"
                    className="group flex items-start gap-3 rounded-xl border border-accent/10 bg-surface-2/60 px-4 py-3 transition-all hover:border-accent/25 hover:bg-surface-2"
                  >
                    <FileText className="h-5 w-5 text-accent/50 group-hover:text-accent shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary group-hover:text-accent truncate">
                          {source.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-text-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-text-secondary">
                        by {source.author}
                        {source.date && ` · ${source.date}`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-accent/5 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-2xl border border-text-tertiary/20 bg-surface-2/50 p-1 transition-colors focus-within:border-text-tertiary/40 cursor-text"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button") === null) {
                textareaRef.current?.focus();
              }
            }}
          >
            <div className="px-4 pt-3 pb-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask another question..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between px-3 pb-2">
              <div className="text-xs text-text-tertiary/60">Knowledge Hub</div>
              {isLoading ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-500/15 text-red-400 transition-colors hover:bg-red-500/25"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                    input.trim()
                      ? "bg-accent text-background hover:bg-accent-hover"
                      : "text-text-tertiary/40",
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-chat text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="text-base font-semibold text-text-primary mt-4 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-sm font-semibold text-text-primary mt-3 mb-1.5">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-sm font-medium text-text-primary mt-2 mb-1">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-text-primary/90 mb-2 last:mb-0">{children}</p>
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
            <ul className="list-disc pl-4 mb-2 space-y-0.5 text-text-primary/90 marker:text-accent/40">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 space-y-0.5 text-text-primary/90">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-sm">{children}</li>,
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
          hr: () => <hr className="my-3 border-accent/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
