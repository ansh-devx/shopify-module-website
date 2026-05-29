/**
 * Token Generator client. All requests go through Next.js API routes under
 * /api/token-generator/*, which authenticate the caller via NextAuth and
 * forward the request to AWS with a Cognito IdToken attached server-side.
 * The browser never holds Cognito or AWS credentials.
 */

const BASE = "/api/token-generator";

/** Live Store: paste installation URL from Partners */
export interface GenerateInstallUrlLiveBody {
  installationUrl: string;
  secret: string;
  scopes: string;
  userId: string;
  userName: string;
}

/** Dev Store: build install URL from store + credentials */
export interface GenerateInstallUrlDevBody {
  store: string;
  clientId: string;
  secret: string;
  scopes: string;
  appName?: string;
  userId: string;
  userName: string;
}

export type GenerateInstallUrlBody =
  | GenerateInstallUrlLiveBody
  | GenerateInstallUrlDevBody;

export interface GenerateInstallUrlResponse {
  installUrl: string;
}

export interface GetTokenResponse {
  access_token: string;
}

export interface TokenListItem {
  id: string;
  store: string;
  scopes: string;
  token: string;
  app_name: string;
  user_name?: string;
  created_at: number;
  /** Masked storefront token (e.g. "****abcd"), or null if not generated yet. */
  storefront_token?: string | null;
  storefront_token_title?: string | null;
  storefront_created_at?: number | null;
}

export interface TokensPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
}

export interface ListTokensResponse {
  tokens: TokenListItem[];
  pagination: TokensPagination;
}

export interface ListTokensOptions {
  limit?: number; // 1–100, default 10
  page?: number; // 1-based, default 1
}

async function handleResponse<T>(res: Response, parseJson = true): Promise<T> {
  const body = parseJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const message =
      typeof (body as { error?: string }).error === "string"
        ? (body as { error: string }).error
        : res.statusText || "Request failed";
    throw new Error(message);
  }
  return body as T;
}

export async function generateInstallUrl(
  body: GenerateInstallUrlLiveBody | GenerateInstallUrlDevBody,
): Promise<GenerateInstallUrlResponse> {
  const res = await fetch(`${BASE}/generate-install-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<GenerateInstallUrlResponse>(res);
}

export async function getToken(code: string): Promise<GetTokenResponse> {
  const res = await fetch(`${BASE}/token?code=${encodeURIComponent(code)}`, {
    method: "GET",
  });
  return handleResponse<GetTokenResponse>(res);
}

export async function revealToken(
  userId: string,
  tokenId: string,
): Promise<GetTokenResponse> {
  const params = new URLSearchParams();
  params.set("userId", userId);
  params.set("tokenId", tokenId);
  const res = await fetch(`${BASE}/token/reveal?${params.toString()}`, {
    method: "GET",
  });
  return handleResponse<GetTokenResponse>(res);
}

export interface GenerateStorefrontTokenResponse {
  /** Full token, returned ONCE on creation so the user can copy it. */
  access_token: string;
  /** Masked token (e.g. "****abcd") — persisted on the backend record. */
  storefront_token: string;
  storefront_token_title: string;
  storefront_created_at?: number;
}

/**
 * Generate a Storefront access token for an existing row. The backend reveals
 * the row's admin token, calls Shopify, and persists the storefront token on
 * the same record. The browser only provides the token id and a title.
 */
export async function generateStorefrontToken(
  tokenId: string,
  title: string,
): Promise<GenerateStorefrontTokenResponse> {
  const res = await fetch(`${BASE}/storefront-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokenId, title }),
  });
  return handleResponse<GenerateStorefrontTokenResponse>(res);
}

/** Reveal the full (unmasked) storefront token for a row. */
export async function revealStorefrontToken(
  tokenId: string,
): Promise<GetTokenResponse> {
  const params = new URLSearchParams({ tokenId });
  const res = await fetch(
    `${BASE}/storefront-token/reveal?${params.toString()}`,
    { method: "GET" },
  );
  return handleResponse<GetTokenResponse>(res);
}

export interface GetConfigResponse {
  callbackUrl: string | null;
  message?: string;
}

export async function getConfig(): Promise<GetConfigResponse> {
  const res = await fetch(`${BASE}/config`, { method: "GET" });
  return handleResponse<GetConfigResponse>(res);
}

export async function listTokens(
  userId: string,
  options: ListTokensOptions = {},
): Promise<ListTokensResponse> {
  const params = new URLSearchParams();
  params.set("userId", userId);
  const limit = options.limit ?? 10;
  params.set("limit", String(Math.min(100, Math.max(1, limit))));
  const page = options.page ?? 1;
  params.set("page", String(Math.max(1, page)));
  const res = await fetch(`${BASE}/tokens?${params.toString()}`, {
    method: "GET",
  });
  return handleResponse<ListTokensResponse>(res);
}
