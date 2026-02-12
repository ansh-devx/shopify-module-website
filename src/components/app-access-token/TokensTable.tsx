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
      <div className="rounded-xl border border-gray-600/80 bg-[#151d1e] px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-shopify-green/10">
          <Plus className="h-10 w-10 text-shopify-green" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          No tokens yet
        </h3>
        <p className="mx-auto max-w-sm text-sm text-white/60">
          Click &quot;Generate Token&quot; above to create your first app access token.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-gray-600/80 bg-[#151d1e] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600 bg-[#0d1213]/80">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Store
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  User
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
              {tokens.map((token, index) => (
                <tr
                  key={`${token.id}-${index}`}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {token.store}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {token.user_name ?? "—"}
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
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-600 bg-[#151d1e] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gray-500 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-shopify-green/40 focus:ring-offset-2 focus:ring-offset-[#0d1213] disabled:opacity-50"
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
