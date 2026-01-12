"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { GroupedResults, SearchableItem } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  results: GroupedResults[];
  popularPages?: SearchableItem[];
  query: string;
  selectedIndex: number;
  onSelect: (href: string) => void;
}

export default function SearchResults({
  results,
  popularPages,
  query,
  selectedIndex,
  onSelect,
}: SearchResultsProps) {
  const router = useRouter();

  // Show popular pages if no query
  if (!query && popularPages && popularPages.length > 0) {
    return (
      <div className="mt-8 max-h-96 overflow-y-auto">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">
          Popular Pages
        </div>
        <div className="space-y-4">
          {popularPages.map((page, index) => (
            <ResultItem
              key={page.id}
              item={page}
              isSelected={index === selectedIndex}
              onClick={() => onSelect(page.href)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show "no results" if query exists but no results
  if (query && results.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg text-white/80">
          No results found for &quot;{query}&quot;
        </p>
        <p className="mt-4 text-sm text-white/60">
          Try searching with different keywords or{" "}
          <a
            href="https://shopify.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-shopify-green hover:underline"
          >
            visit the official Shopify docs
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </a>
        </p>
      </div>
    );
  }

  // Show grouped results
  let globalIndex = 0;
  return (
    <div className="mt-4 max-h-96 overflow-y-auto">
      {results.map((group) => (
        <div key={group.category} className="mb-4">
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-white/60">
            {group.category}
          </div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const currentIndex = globalIndex++;
              return (
                <ResultItem
                  key={item.id}
                  item={item}
                  isSelected={currentIndex === selectedIndex}
                  onClick={() => onSelect(item.href)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ResultItemProps {
  item: SearchableItem;
  isSelected: boolean;
  onClick: () => void;
}

function ResultItem({ item, isSelected, onClick }: ResultItemProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
        isSelected ? "bg-[#2e3739] text-white" : "text-white hover:bg-[#2e3739]"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <div className="flex-1">
        <div className="font-medium">{item.title}</div>
        {item.breadcrumb.length > 1 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
            {item.breadcrumb.slice(0, -1).map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {crumb}
                <ChevronRight className="h-3 w-3" />
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
    </button>
  );
}
