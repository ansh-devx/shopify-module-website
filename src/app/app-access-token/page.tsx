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
import { getToken, listTokens, getConfig } from "@/lib/tokenGeneratorApi";
import type { TokenListItem } from "@/lib/tokenGeneratorApi";
import { Copy, Check, ChevronRight, AlertCircle, KeyRound } from "lucide-react";

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

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-shopify-green" />
      ) : (
        <Copy className="h-4 w-4 text-white/60 hover:text-white" />
      )}
    </button>
  );
}

function AppAccessTokenContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const shop = searchParams.get("shop");

  const [isRedirectingToOAuth, setIsRedirectingToOAuth] = useState(false);
  useEffect(() => {
    if (shop && !code && !errorParam) {
      setIsRedirectingToOAuth(true);
      window.location.href = `https://j32l7w0fjb.execute-api.ap-south-1.amazonaws.com/Prod/start-oauth?shop=${encodeURIComponent(shop)}`;
    }
  }, [shop, code, errorParam]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"steps" | "form">("steps");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [redirectUrlMessage, setRedirectUrlMessage] = useState<string | null>(
    null,
  );
  const [redirectUrlLoading, setRedirectUrlLoading] = useState(false);
  const [redirectUrlError, setRedirectUrlError] = useState<string | null>(null);
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

  if (isRedirectingToOAuth) {
    return <Loader />;
  }

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
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-shopify-green/20">
              <KeyRound className="h-6 w-6 text-shopify-green" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                App Access Token
              </h1>
              <p className="text-sm text-white/60">
                Copy your token below; it won’t be shown again.
              </p>
            </div>
          </div>
          {tokenError ? (
            <div className="flex gap-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-6">
              <AlertCircle className="h-6 w-6 shrink-0 text-amber-400" />
              <div>
                <p className="font-medium text-amber-200">
                  This link has already been used or has expired.
                </p>
                <Link
                  href="/app-access-token"
                  className="mt-3 inline-flex items-center gap-1.5 text-shopify-green hover:underline"
                >
                  Back to Token Generator
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : accessToken ? (
            <div className="space-y-6 rounded-xl border border-gray-600 bg-[#151d1e] p-6">
              <CopyableText
                label="Access token (copy now; it won’t be shown again)"
                text={accessToken}
              />
              <div className="flex flex-wrap items-center gap-3 border-t border-gray-600/80 pt-6">
                <button
                  type="button"
                  onClick={clearTokenAndUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-shopify-green px-5 py-2.5 font-medium text-white transition-colors hover:bg-shopify-green/90 focus:outline-none focus:ring-2 focus:ring-shopify-green/50 focus:ring-offset-2 focus:ring-offset-[#151d1e]"
                >
                  <Check className="h-4 w-4" />
                  Done, clear and go back
                </button>
                <Link
                  href="/app-access-token"
                  className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                >
                  Back to Token Generator
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-gray-600 bg-[#151d1e] p-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-shopify-green border-t-transparent" />
              <p className="text-white/80">Exchanging code for token…</p>
            </div>
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
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Something went wrong
              </h1>
              <p className="text-sm text-white/60">
                We couldn’t complete the authorization.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl border border-red-500/40 bg-red-500/10 p-6">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-red-200">{message}</p>
              <Link
                href="/app-access-token"
                className="mt-4 inline-flex items-center gap-1.5 text-shopify-green hover:underline"
              >
                Back to Token Generator
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main mode: Generate Token button + table
  return (
    <div className="min-h-screen bg-[#0d1213] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              App Access Tokens
            </h1>
            <p className="mt-1.5 text-white/60">
              Manage your Shopify app access tokens for API integration
            </p>
          </div>
          <button
            onClick={() => {
              setModalStep("steps");
              setRedirectUrl(null);
              setRedirectUrlMessage(null);
              setRedirectUrlError(null);
              setIsModalOpen(true);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-shopify-green px-6 py-3.5 font-semibold text-white shadow-lg shadow-shopify-green/20 transition-all hover:bg-shopify-green/90 hover:shadow-shopify-green/30 focus:outline-none focus:ring-2 focus:ring-shopify-green/50 focus:ring-offset-2 focus:ring-offset-[#0d1213] sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Generate Token
          </button>
        </div>

        {tokensError && (
          <div className="mb-6 flex gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="text-red-200">{tokensError}</p>
              <button
                type="button"
                onClick={() =>
                  session?.user?.id && fetchFirstPage(session.user.id)
                }
                className="mt-2 text-sm font-medium text-shopify-green hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {tokensLoading ? (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-600 bg-[#151d1e] py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-shopify-green border-t-transparent" />
            <span className="text-white/70">Loading tokens…</span>
          </div>
        ) : (
          <TokensTable
            userId={userId}
            tokens={tokens}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isLoadingMore={tokensLoadingMore}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalStep("steps");
            setRedirectUrl(null);
            setRedirectUrlMessage(null);
            setRedirectUrlError(null);
          }}
          title={
            modalStep === "steps" ? "Set up your app first" : "Generate Token"
          }
          size="lg"
        >
          {modalStep === "steps" ? (
            <div className="space-y-6">
              <p className="text-sm text-white/70">
                Complete these steps in the{" "}
                <span className="font-medium text-white/90">
                  Shopify Partners (Dev) Dashboard
                </span>
                , then continue to the form.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shopify-green/20 text-sm font-semibold text-shopify-green">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-white">Create app</p>
                    <p className="text-sm text-white/60">
                      Create a new app in Partners if you haven’t already.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shopify-green/20 text-sm font-semibold text-shopify-green">
                    2
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="font-medium text-white">Create Version</p>
                    <ul className="space-y-2.5 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                        Select scopes
                      </li>
                      <li className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                          Set Redirect URL
                          {redirectUrl === null && !redirectUrlError && (
                            <button
                              type="button"
                              onClick={() => {
                                setRedirectUrlLoading(true);
                                setRedirectUrlError(null);
                                getConfig()
                                  .then((res) => {
                                    if (res.callbackUrl) {
                                      setRedirectUrl(res.callbackUrl);
                                      setRedirectUrlMessage(
                                        res.message ?? null,
                                      );
                                    } else {
                                      setRedirectUrlError(
                                        "Could not determine callback URL",
                                      );
                                    }
                                  })
                                  .catch((err) =>
                                    setRedirectUrlError(
                                      err instanceof Error
                                        ? err.message
                                        : "Failed to load redirect URL",
                                    ),
                                  )
                                  .finally(() => setRedirectUrlLoading(false));
                              }}
                              disabled={redirectUrlLoading}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-shopify-green/50 bg-shopify-green/10 px-2.5 py-1.5 text-xs font-medium text-shopify-green transition-colors hover:bg-shopify-green/20 disabled:opacity-50"
                            >
                              {redirectUrlLoading ? (
                                <>
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-shopify-green border-t-transparent" />
                                  Loading…
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Show Redirect URL
                                </>
                              )}
                            </button>
                          )}
                        </span>
                        {redirectUrl && (
                          <div className="ml-3.5 space-y-1.5">
                            <div className="flex items-center gap-2 rounded-lg border border-gray-600 bg-[#0d1213] px-3 py-2.5 font-mono text-xs text-white/90">
                              <span className="min-w-0 flex-1 truncate">
                                {redirectUrl}
                              </span>
                              <CopyButton
                                text={redirectUrl}
                                className="shrink-0 rounded p-1.5 transition-colors hover:bg-white/10"
                              />
                            </div>
                            {redirectUrlMessage && (
                              <p className="text-xs text-white/60">
                                {redirectUrlMessage}
                              </p>
                            )}
                          </div>
                        )}
                        {redirectUrlError && (
                          <p className="ml-3.5 text-xs text-red-400">
                            {redirectUrlError}
                          </p>
                        )}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                        App URL:{" "}
                        <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs">
                          https://j32l7w0fjb.execute-api.ap-south-1.amazonaws.com/Prod/start-oauth
                        </code>
                        <CopyButton
                          text="https://j32l7w0fjb.execute-api.ap-south-1.amazonaws.com/Prod/start-oauth"
                          className="shrink-0 rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                        />
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                        Set Embed App: <strong>true</strong>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                        Release
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shopify-green/20 text-sm font-semibold text-shopify-green">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-white">
                      Select Custom distribution
                    </p>
                    <p className="text-sm text-white/60">
                      Go to Home in your app navigation and select Distribution,
                      then choose Custom distribution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-600/80 pt-6">
                <button
                  type="button"
                  onClick={() => setModalStep("form")}
                  className="inline-flex items-center gap-2 rounded-xl bg-shopify-green px-5 py-2.5 font-semibold text-white transition-all hover:bg-shopify-green/90 focus:outline-none focus:ring-2 focus:ring-shopify-green/50 focus:ring-offset-2 focus:ring-offset-[#151d1e]"
                >
                  I&apos;ve done this, continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <GenerateTokenForm
              userId={userId}
              userName={session.user.name ?? session.user.email ?? ""}
              onSuccess={() => {
                setIsModalOpen(false);
                setModalStep("steps");
                setRedirectUrl(null);
                setRedirectUrlMessage(null);
                setRedirectUrlError(null);
                if (session?.user?.id) fetchFirstPage(session.user.id);
              }}
            />
          )}
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
