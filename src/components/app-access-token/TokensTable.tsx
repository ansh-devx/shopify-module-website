"use client";

import { useState } from "react";
import { Plus, Loader2, Eye } from "lucide-react";
import type { TokenListItem } from "@/lib/tokenGeneratorApi";
import { revealToken } from "@/lib/tokenGeneratorApi";
import Modal from "@/components/ui/Modal";
import CopyableText from "@/components/app-access-token/form/CopyableText";

interface TokensTableProps {
  userId: string;
  tokens: TokenListItem[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export default function TokensTable({
  userId,
  tokens,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: TokensTableProps) {
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [revealingId, setRevealingId] = useState<string | null>(null);

  const handleReveal = async (tokenId: string) => {
    setRevealingId(tokenId);
    setRevealError(null);
    setRevealedToken(null);
    try {
      const res = await revealToken(userId, tokenId);
      setRevealedToken(res.access_token);
      setRevealModalOpen(true);
    } catch (err) {
      setRevealError(
        err instanceof Error ? err.message : "Failed to reveal token",
      );
      setRevealModalOpen(true);
    } finally {
      setRevealingId(null);
    }
  };
  if (tokens.length === 0 && !isLoadingMore) {
    return (
      <div className="rounded-xl border border-accent/10/80 bg-background px-8 py-16 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
          <Plus className="h-10 w-10 text-accent" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">No tokens yet</h3>
        <p className="mx-auto max-w-sm text-sm text-text-tertiary">
          Click &quot;Generate Token&quot; above to create your first app access
          token.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-accent/10/80 bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-screen">
            <thead>
              <tr className="border-b border-accent/10 bg-surface-1/80">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Store
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Token
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  App name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Scopes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  User
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
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{token.token}</span>
                      <button
                        type="button"
                        onClick={() => handleReveal(token.id)}
                        disabled={revealingId !== null}
                        className="shrink-0 rounded-lg border border-gray-500 bg-surface-1 px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                        title="Reveal full token"
                      >
                        {revealingId === token.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {token.app_name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    <div className="max-w-xs truncate" title={token.scopes}>
                      {token.scopes}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {token.user_name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(token.created_at * 1000).toLocaleString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={revealModalOpen}
        onClose={() => {
          setRevealModalOpen(false);
          setRevealedToken(null);
          setRevealError(null);
        }}
        title="Revealed token"
        size="md"
      >
        {revealError ? (
          <p className="text-sm text-red-400">{revealError}</p>
        ) : revealedToken ? (
          <CopyableText
            label="Access token (copy and store securely)"
            text={revealedToken}
          />
        ) : null}
      </Modal>

      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/10 bg-background px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gray-500 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-[#0d1213] disabled:opacity-50"
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
