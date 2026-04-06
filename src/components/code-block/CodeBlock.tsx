"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export default function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "group relative my-6 overflow-hidden rounded-lg border border-accent/10",
        className
      )}
    >
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-accent/10 bg-surface-1 px-4 py-2">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-medium text-gray-700">
                {filename}
              </span>
            )}
            {language && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-text-secondary">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm text-text-secondary transition-colors hover:bg-gray-200 hover:text-text-primary"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code Content */}
      <div className="overflow-x-auto bg-black">
        <pre className="p-4">
          <code className="text-sm text-white/90">
            {lines.map((line, index) => (
              <div key={index} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell select-none pr-4 text-right text-white/40">
                    {index + 1}
                  </span>
                )}
                <span className="table-cell">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Copy button (floating) - shown on hover if no header */}
      {!filename && !language && (
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 cursor-pointer rounded bg-accent/10 p-2 text-text-secondary opacity-0 transition-opacity hover:bg-white/15 hover:text-white group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}
