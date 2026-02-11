"use client";

import { Plus, Loader2 } from "lucide-react";
import type { TokenListItem } from "@/lib/tokenGeneratorApi";

interface TokensTableProps {
  tokens: TokenListItem[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export default function TokensTable({
  tokens,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: TokensTableProps) {
  if (tokens.length === 0 && !isLoadingMore) {
    return (
      <div className="rounded-xl border border-gray-600 bg-[#151d1e] p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-shopify-green/10">
          <Plus className="h-8 w-8 text-shopify-green" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          No tokens yet
        </h3>
        <p className="text-white/60">
          Generate one using the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-600 bg-[#151d1e]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600 bg-[#0d1213]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Store
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Scopes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Token
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  App name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Created at
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {tokens.map((token) => (
                <tr
                  key={token.id}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {token.store}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    <div className="max-w-xs truncate" title={token.scopes}>
                      {token.scopes}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-white/70">
                    {token.token}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {token.app_name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {new Date(token.created_at * 1000).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 rounded-lg border border-gray-600 bg-[#151d1e] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gray-500 hover:bg-white/5 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more…
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
