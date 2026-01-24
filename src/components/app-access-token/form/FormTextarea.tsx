"use client";

import { cn } from "@/lib/utils";

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
}

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : helpText ? `${name}-help` : undefined
        }
        className={cn(
          "w-full px-4 py-3 rounded-lg border-2 transition-all duration-150",
          "bg-[#151d1e] text-white placeholder-white/40",
          "focus:outline-none focus:ring-2 focus:ring-shopify-green/50",
          "resize-vertical",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-600 hover:border-gray-500 focus:border-shopify-green"
        )}
      />

      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${name}-help`} className="text-sm text-white/60">
          {helpText}
        </p>
      )}
    </div>
  );
}

