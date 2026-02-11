"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import Loader from "@/components/ui/Loader";
import AuthModal from "@/components/auth/AuthModal";
import Modal from "@/components/ui/Modal";
import TokensTable from "@/components/app-access-token/TokensTable";
import GenerateTokenForm from "@/components/app-access-token/GenerateTokenForm";
import CopyableText from "@/components/app-access-token/form/CopyableText";
import { getToken, listTokens } from "@/lib/tokenGeneratorApi";
import type { TokenListItem } from "@/lib/tokenGeneratorApi";

const TOKENS_PAGE_SIZE = 10;

const ERROR_MESSAGES: Record<string, string> = {
  invalid_hmac: "Verification failed. Please try generating the token again.",
  invalid_state:
    "Session expired or invalid. Please start from the beginning and generate a new token.",
  invalid_shop: "Invalid store. Please check the store name and try again.",
  token_exchange_failed:
    "We couldn't get the token from Shopify. Please try again.",
  missing_params: "Something went wrong during the redirect. Please try again.",
};

function getErrorMessage(errorValue: string): string {
  return (
    ERROR_MESSAGES[errorValue] ?? "Something went wrong. Please try again."
  );
}

function AppAccessTokenContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState<TokenListItem[]>([]);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [tokensLoadingMore, setTokensLoadingMore] = useState(false);
  const [tokensError, setTokensError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Token success mode: single-use code exchange
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const tokenFetchedRef = useRef(false);

  useEffect(() => {
    if (!code || tokenFetchedRef.current) return;
    tokenFetchedRef.current = true;
    getToken(code)
      .then((res) => setAccessToken(res.access_token))
      .catch((err) =>
        setTokenError(
          err instanceof Error ? err.message : "Invalid or expired code",
        ),
      );
  }, [code]);

  // After showing token, clear from UI and remove ?code= from URL
  const clearTokenAndUrl = () => {
    setAccessToken(null);
    router.replace("/app-access-token");
  };

  const fetchFirstPage = (uid: string) => {
    setTokensLoading(true);
    setTokensError(null);
    setCurrentPage(1);
    setHasMore(false);
    listTokens(uid, { limit: TOKENS_PAGE_SIZE, page: 1 })
      .then((res) => {
        setTokens(res.tokens);
        setHasMore(res.pagination?.hasMore ?? false);
        setCurrentPage(res.pagination?.page ?? 1);
      })
      .catch((err) =>
        setTokensError(
          err instanceof Error ? err.message : "Failed to load tokens",
        ),
      )
      .finally(() => setTokensLoading(false));
  };

  const loadMore = () => {
    if (!session?.user?.id || !hasMore || tokensLoadingMore) return;
    const nextPage = currentPage + 1;
    setTokensLoadingMore(true);
    listTokens(session.user.id, {
      limit: TOKENS_PAGE_SIZE,
      page: nextPage,
    })
      .then((res) => {
        setTokens((prev) => [...prev, ...res.tokens]);
        setHasMore(res.pagination?.hasMore ?? false);
        setCurrentPage(res.pagination?.page ?? nextPage);
      })
      .catch((err) =>
        setTokensError(
          err instanceof Error ? err.message : "Failed to load more tokens",
        ),
      )
      .finally(() => setTokensLoadingMore(false));
  };

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.id ||
      code ||
      errorParam
    ) {
      return;
    }
    let cancelled = false;
    const uid = session.user.id;
    const applyLoading = () => {
      setTokensLoading(true);
      setTokensError(null);
      setCurrentPage(1);
      setHasMore(false);
    };
    queueMicrotask(applyLoading);
    listTokens(uid, { limit: TOKENS_PAGE_SIZE, page: 1 })
      .then((res) => {
        if (cancelled) return;
        setTokens(res.tokens);
        setHasMore(res.pagination?.hasMore ?? false);
        setCurrentPage(res.pagination?.page ?? 1);
      })
      .catch((err) => {
        if (cancelled) return;
        setTokensError(
          err instanceof Error ? err.message : "Failed to load tokens",
        );
      })
      .finally(() => {
        if (!cancelled) setTokensLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.id, code, errorParam]);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session?.user) {
    return (
      <>
        <div className="pointer-events-none">
          <div className="min-h-screen bg-[#0d1213]" />
        </div>
        <AuthModal fullScreen={true} />
      </>
    );
  }

  const userId = session.user.id;

  // Success: we have ?code= and have fetched the token
  if (code) {
    return (
      <div className="min-h-screen bg-[#0d1213] p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold text-white">
            App Access Token
          </h1>
          {tokenError ? (
            <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-6 text-amber-200">
              <p>This link has already been used or has expired.</p>
              <Link
                href="/app-access-token"
                className="mt-4 inline-block text-shopify-green hover:underline"
              >
                Back to Token Generator
              </Link>
            </div>
          ) : accessToken ? (
            <div className="space-y-6">
              <CopyableText
                label="Access token (copy now; it won’t be shown again)"
                text={accessToken}
              />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={clearTokenAndUrl}
                  className="rounded-lg bg-shopify-green px-4 py-2 font-medium text-white hover:bg-shopify-green/90"
                >
                  Done, clear and go back
                </button>
                <Link
                  href="/app-access-token"
                  className="text-white/70 hover:text-white"
                >
                  Back to Token Generator
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-white/70">Exchanging code for token…</p>
          )}
        </div>
      </div>
    );
  }

  // Error: backend redirected with ?error=
  if (errorParam) {
    const message = getErrorMessage(errorParam);
    return (
      <div className="min-h-screen bg-[#0d1213] p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold text-white">
            Something went wrong
          </h1>
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-6 text-red-200">
            <p>{message}</p>
            <Link
              href="/app-access-token"
              className="mt-4 inline-block text-shopify-green hover:underline"
            >
              Back to Token Generator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main mode: Generate Token button + table
  return (
    <div className="min-h-screen bg-[#0d1213] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">App Access Tokens</h1>
            <p className="mt-2 text-white/60">
              Manage your Shopify app access tokens for API integration
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-shopify-green px-6 py-3 font-semibold text-white transition-all hover:bg-shopify-green/90 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Generate Token
          </button>
        </div>

        {tokensError && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
            <p>{tokensError}</p>
            <button
              type="button"
              onClick={() =>
                session?.user?.id && fetchFirstPage(session.user.id)
              }
              className="mt-2 text-sm underline"
            >
              Retry
            </button>
          </div>
        )}

        {tokensLoading ? (
          <div className="rounded-xl border border-gray-600 bg-[#151d1e] p-12 text-center text-white/60">
            Loading tokens…
          </div>
        ) : (
          <TokensTable
            tokens={tokens}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isLoadingMore={tokensLoadingMore}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Generate Token"
          size="lg"
        >
          <GenerateTokenForm
            userId={userId}
            onSuccess={() => {
              setIsModalOpen(false);
              if (session?.user?.id) fetchFirstPage(session.user.id);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

export default function AppAccessTokenPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AppAccessTokenContent />
    </Suspense>
  );
}
