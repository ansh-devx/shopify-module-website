"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
}

export default function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  required = false,
  error,
}: FormCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onClick={() => onChange(!checked)}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-150",
            "flex items-center justify-center",
            "focus:outline-none focus:ring-2 focus:ring-accent/50",
            checked
              ? "bg-accent border-accent"
              : error
                ? "border-red-500 bg-background"
                : "border-accent/10 bg-background hover:border-gray-500"
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </button>

        <label
          htmlFor={name}
          onClick={() => onChange(!checked)}
          className="text-sm text-white cursor-pointer select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500 ml-8">
          {error}
        </p>
      )}
    </div>
  );
}

