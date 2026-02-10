/**
 * Token Generator backend API client.
 * Base URL: NEXT_PUBLIC_API_BASE_URL (no trailing slash).
 */

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url?.trim()) {
    if (typeof window !== "undefined") {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
    }
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return url.replace(/\/$/, "");
}

export interface GenerateInstallUrlBody {
  store: string;
  appName?: string;
  clientId: string;
  secret: string;
  scopes: string;
  userId: string;
}

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
  created_at: number;
}

export interface ListTokensResponse {
  tokens: TokenListItem[];
}

async function handleResponse<T>(res: Response, parseJson = true): Promise<T> {
  const body = parseJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const message = typeof (body as { error?: string }).error === "string"
      ? (body as { error: string }).error
      : res.statusText || "Request failed";
    throw new Error(message);
  }
  return body as T;
}

export async function generateInstallUrl(
  body: GenerateInstallUrlBody
): Promise<GenerateInstallUrlResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/generate-install-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<GenerateInstallUrlResponse>(res);
}

export async function getToken(code: string): Promise<GetTokenResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/token?code=${encodeURIComponent(code)}`, {
    method: "GET",
  });
  return handleResponse<GetTokenResponse>(res);
}

export async function listTokens(userId: string): Promise<ListTokensResponse> {
  const base = getApiBaseUrl();
  const res = await fetch(
    `${base}/tokens?userId=${encodeURIComponent(userId)}`,
    { method: "GET" }
  );
  return handleResponse<ListTokensResponse>(res);
}
