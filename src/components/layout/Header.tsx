"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import UserProfile from "@/components/auth/UserProfile";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { openSearch } = useSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-accent/10 bg-background/80 backdrop-blur-xl">
      <nav className="flex items-center justify-between p-4 lg:px-8">
        <div className="flex flex-1 items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center rounded-lg p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

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

        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-[400px] mr-4">
          <button
            type="button"
            onClick={openSearch}
            className="group flex cursor-pointer justify-between items-center gap-2 w-full rounded-lg border border-accent/10 bg-surface-1/50 px-3 py-2 text-sm text-text-tertiary transition-all duration-300 hover:border-accent/25 hover:text-text-secondary"
            aria-label="Search documentation"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>
            <kbd className="hidden rounded border border-accent/10 bg-surface-2 px-2 py-0.5 text-xs text-text-tertiary sm:inline">
              ⌘ K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Search icon — mobile only */}
          <button
            type="button"
            onClick={openSearch}
            className="sm:hidden flex items-center justify-center rounded-lg p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <UserProfile />
        </div>
      </nav>
    </header>
  );
}
