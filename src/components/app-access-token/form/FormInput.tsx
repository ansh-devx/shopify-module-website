"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password" | "email" | "url";
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  showToggle?: boolean;
  autoFocus?: boolean;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  helpText,
  showToggle = false,
  autoFocus = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType =
    showToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helpText ? `${name}-help` : undefined
          }
          className={cn(
            "w-full px-4 py-3 rounded-lg border-2 transition-all duration-150",
            "bg-[#151d1e] text-white placeholder-white/40 outline-none",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-600 hover:border-gray-500 focus:border-shopify-green",
          )}
        />

        {showToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

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
