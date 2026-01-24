"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { RadioOption } from "@/types/app-access-token";

interface FormCheckboxGroupProps {
  label: string;
  name: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
}

export default function FormCheckboxGroup({
  label,
  name,
  values,
  onChange,
  options,
  required = false,
  error,
}: FormCheckboxGroupProps) {
  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      // Remove from array
      onChange(values.filter((v) => v !== optionValue));
    } else {
      // Add to array
      onChange([...values, optionValue]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = values.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-required={required}
              onClick={() => handleToggle(option.value)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all duration-150",
                "focus:outline-none focus:ring-2 focus:ring-shopify-green/50",
                isSelected
                  ? "border-shopify-green bg-shopify-green/5"
                  : "border-gray-600 bg-[#151d1e] hover:border-gray-500",
              )}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={cn(
                    "shrink-0 w-5 h-5 rounded border-2 transition-all duration-150",
                    "flex items-center justify-center mt-0.5",
                    isSelected
                      ? "border-shopify-green bg-shopify-green"
                      : "border-gray-600",
                  )}
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
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

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
