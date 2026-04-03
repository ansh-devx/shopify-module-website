"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Send, Square, Bot, User, Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/code-block/CodeBlock";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Welcome state — greeting + centered input
  if (!hasMessages) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
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
          <span className="inline-block text-accent-warm mr-2">
            <Asterisk
              className="h-10 w-10 sm:h-12 sm:w-12 inline -mt-2"
              strokeWidth={1.5}
            />
          </span>
          {getGreeting()}, {firstName}!
        </h1>

        {/* Input */}
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border border-text-tertiary/20 bg-surface-2/50 p-1 transition-colors focus-within:border-text-tertiary/40">
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
            <div className="flex items-center justify-between px-3 pb-2">
              <div className="text-xs text-text-tertiary/60">Knowledge Hub</div>
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
    <div className="flex h-[calc(100vh-4rem)] flex-col">
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
                  "rounded-2xl px-4",
                  message.role === "user"
                    ? "max-w-[75%] bg-surface-3 text-text-primary"
                    : "max-w-[90%]",
                )}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return message.role === "assistant" ? (
                      <MarkdownContent key={i} content={part.text} />
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

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-accent/5 px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-text-tertiary/20 bg-surface-2/50 p-1 transition-colors focus-within:border-text-tertiary/40">
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
            // Extract language and code string from the nested <code> element
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
