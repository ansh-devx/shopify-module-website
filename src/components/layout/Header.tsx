"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";

export default function Header() {
  const { openSearch } = useSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-green-900 bg-black/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-shopify-green">
              Shopify Learn
            </span>
          </Link>
        </div>

        {/* Search button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="group flex items-center gap-2 rounded-md border border-green-900 bg-black px-3 py-2 text-sm text-white/60 transition-colors hover:border-shopify-green hover:text-white"
            aria-label="Search documentation"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-green-900 bg-green-950 px-2 py-0.5 text-xs text-white/60 group-hover:border-shopify-green sm:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
