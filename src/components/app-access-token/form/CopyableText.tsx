"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableTextProps {
  text: string;
  label?: string;
}

export default function CopyableText({ text, label }: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white">{label}</label>
      )}

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex-1 px-4 py-3 rounded-lg border-2 border-accent/10",
            "bg-background text-white font-mono text-sm",
            "overflow-x-auto whitespace-nowrap"
          )}
        >
          {text}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex-shrink-0 p-3 rounded-lg border-2 transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-accent/50",
            copied
              ? "border-accent bg-accent text-white"
              : "border-accent/10 bg-background text-text-secondary hover:text-white hover:border-gray-500"
          )}
          aria-label={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </div>

      {copied && (
        <p className="text-sm text-accent">Copied to clipboard!</p>
      )}
    </div>
  );
}

