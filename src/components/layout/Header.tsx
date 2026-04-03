"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import UserProfile from "@/components/auth/UserProfile";

export default function Header() {
  const { openSearch } = useSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-accent/10 bg-background/80 backdrop-blur-xl">
      <nav className="flex items-center justify-between p-4 lg:px-8">
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

        <div className="flex items-center gap-3 w-[400px] mr-4">
          <button
            type="button"
            onClick={openSearch}
            className="group flex cursor-pointer justify-between items-center gap-2 w-full rounded-lg border border-accent/10 bg-surface-1/50 px-3 py-2 text-sm text-text-tertiary transition-all duration-300 hover:border-accent/25 hover:text-text-secondary"
            aria-label="Search documentation"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </div>
            <kbd className="hidden rounded border border-accent/10 bg-surface-2 px-2 py-0.5 text-xs text-text-tertiary sm:inline">
              ⌘ K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <UserProfile />
        </div>
      </nav>
    </header>
  );
}
