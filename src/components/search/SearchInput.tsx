"use client";

import { Search, X } from "lucide-react";
import { useRef, useEffect } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-text-tertiary" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documentation..."
        className="w-full rounded-lg border border-accent/10 bg-background py-3 pl-12 pr-12 text-lg text-text-primary placeholder-text-tertiary focus:border-accent/20 outline-none transition-colors duration-200"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-text-tertiary hover:text-text-primary"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
