"use client";

import { cn } from "@/lib/utils";
import { RadioOption } from "@/types/app-access-token";

interface FormRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
}

export default function FormRadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
}: FormRadioGroupProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-required={required}
              onClick={() => onChange(option.value)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all duration-150",
                "focus:outline-none focus:ring-2 focus:ring-shopify-green/50",
                isSelected
                  ? "border-shopify-green bg-shopify-green/5"
                  : "border-gray-600 bg-[#151d1e] hover:border-gray-500"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Radio Circle */}
                <div
                  className={cn(
                    "flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-150",
                    "flex items-center justify-center mt-0.5",
                    isSelected
                      ? "border-shopify-green"
                      : "border-gray-600"
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-shopify-green" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="font-medium text-white mb-1">
                    {option.label}
                  </div>
                  <div className="text-sm text-white/70">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

