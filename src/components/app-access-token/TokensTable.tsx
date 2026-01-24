"use client";

import { Edit2, Trash2, Plus } from "lucide-react";
import Badge from "@/components/ui/Badge";

// TODO: Replace with actual data type from API
interface AppAccessToken {
  id: string;
  appName: string;
  apiType: "storefront" | "admin";
  scopes: string;
  storeUrl: string;
  createdAt: string;
}

interface TokensTableProps {
  tokens: AppAccessToken[];
  onEdit?: (token: AppAccessToken) => void;
  onDelete?: (token: AppAccessToken) => void;
}

export default function TokensTable({
  tokens,
  onEdit,
  onDelete,
}: TokensTableProps) {
  // Empty state
  if (tokens.length === 0) {
    return (
      <div className="rounded-xl border border-gray-600 bg-[#151d1e] p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-shopify-green/10">
          <Plus className="h-8 w-8 text-shopify-green" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          No tokens created yet
        </h3>
        <p className="text-white/60">
          Click &quot;Create New Token&quot; to get started with your first app
          access token.
        </p>
      </div>
    );
  }

  // Table with data
  return (
    <div className="overflow-hidden rounded-xl border border-gray-600 bg-[#151d1e]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600 bg-[#0d1213]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                App Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                API Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Scopes
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Store URL
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Created At
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                Actions
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
                  {token.appName}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Badge
                    variant={
                      token.apiType === "admin" ? "info" : "success"
                    }
                  >
                    {token.apiType === "admin" ? "Admin API" : "Storefront API"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-white/70">
                  <div className="max-w-xs truncate" title={token.scopes}>
                    {token.scopes}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-white/70">
                  {token.storeUrl}
                </td>
                <td className="px-6 py-4 text-sm text-white/70">
                  {new Date(token.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit?.(token)}
                      disabled={!onEdit}
                      className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Edit token"
                      title="Edit (Coming soon)"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(token)}
                      disabled={!onDelete}
                      className="rounded-lg p-2 text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Delete token"
                      title="Delete (Coming soon)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

