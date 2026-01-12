"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";

export default function Header() {
  const { openSearch } = useSearch();

  return (
    <header className="sticky top-0 z-50 bg-[#151d1e]/95 backdrop-blur">
      <nav className="flex items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0767/5530/4673/files/devx_shopify.png"
              alt="Shopify Learn"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Search button */}
        <div className="flex items-center gap-3 w-[400px]">
          <button
            type="button"
            onClick={openSearch}
            className="group flex cursor-pointer justify-between items-center gap-2 w-full rounded-md border border-[#24393d] bg-transparent px-3 py-2 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:text-white"
            aria-label="Search documentation"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </div>
            <kbd className="hidden rounded border border-[#24393d] bg-gray-800/50 px-2 py-0.5 text-xs text-gray-400 group-hover:border-gray-600 sm:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
