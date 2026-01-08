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
    <div className={cn("group relative my-6 overflow-hidden rounded-lg border border-gray-200", className)}>
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-medium text-gray-700">{filename}</span>
            )}
            {language && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
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
      <div className="overflow-x-auto bg-gray-900">
        <pre className="p-4">
          <code className="text-sm text-gray-100">
            {lines.map((line, index) => (
              <div key={index} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell select-none pr-4 text-right text-gray-500">
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
          className="absolute right-2 top-2 rounded bg-gray-800 p-2 text-gray-300 opacity-0 transition-opacity hover:bg-gray-700 hover:text-white group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

