"use client";

import { useState } from "react";
import FormInput from "./form/FormInput";
import FormTextarea from "./form/FormTextarea";
import { generateInstallUrl } from "@/lib/tokenGeneratorApi";
import { cn } from "@/lib/utils";

export type FormMode = "live" | "dev";

const initialLive = { installationUrl: "", secret: "" };
const initialDev = {
  store: "",
  appName: "",
  clientId: "",
  secret: "",
  scopes: "",
};

function isValidStore(store: string): boolean {
  const s = store.trim();
  if (s.length < 2 || s.length > 100) return false;
  if (/\s/.test(s)) return false;
  if (s.endsWith(".myshopify.com"))
    return /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.myshopify\.com$/.test(s);
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(s);
}

function isValidClientId(clientId: string): boolean {
  const s = clientId.trim();
  return s.length >= 10 && s.length <= 256 && !/\s/.test(s);
}

function isValidScopes(scopes: string): boolean {
  const s = scopes.trim();
  if (s.length < 3) return false;
  const parts = s
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 1 && parts.every((p) => /^[a-z_][a-z0-9_]*$/i.test(p));
}

function isValidInstallationUrl(url: string): boolean {
  const s = url.trim();
  if (s.length < 10) return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

interface GenerateTokenFormProps {
  userId: string;
  userName: string;
  onSuccess: () => void;
}

export default function GenerateTokenForm({
  userId,
  userName,
  onSuccess,
}: GenerateTokenFormProps) {
  const [mode, setMode] = useState<FormMode>("dev");
  const [liveValues, setLiveValues] = useState(initialLive);
  const [devValues, setDevValues] = useState(initialDev);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [liveErrors, setLiveErrors] = useState<{
    installationUrl?: string;
    secret?: string;
  }>({});
  const [devErrors, setDevErrors] = useState<
    Partial<Record<keyof typeof initialDev, string>>
  >({});

  const validateLive = (): boolean => {
    const err: { installationUrl?: string; secret?: string } = {};
    if (!liveValues.installationUrl.trim()) {
      err.installationUrl = "Shopify Installation URL is required";
    } else if (!isValidInstallationUrl(liveValues.installationUrl)) {
      err.installationUrl = "Enter a valid https URL from Partners Dashboard";
    }
    if (!liveValues.secret) err.secret = "Client Secret is required";
    setLiveErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateDev = (): boolean => {
    const err: Partial<Record<keyof typeof initialDev, string>> = {};
    const { store, clientId, secret, scopes } = devValues;
    if (!store.trim()) {
      err.store = "Store is required";
    } else if (!isValidStore(store)) {
      err.store =
        "Use a store subdomain (e.g. mystore) or full hostname (e.g. mystore.myshopify.com)";
    }
    if (!clientId.trim()) {
      err.clientId = "Client ID is required";
    } else if (!isValidClientId(clientId)) {
      err.clientId =
        "Client ID should be from the Shopify Partners dashboard (at least 10 characters)";
    }
    if (!secret) err.secret = "Client Secret is required";
    if (!scopes.trim()) {
      err.scopes = "Scopes are required";
    } else if (!isValidScopes(scopes)) {
      err.scopes =
        "Enter comma-separated scopes (e.g. read_products, write_products)";
    }
    setDevErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const displayName = userName.trim() || "User";

    if (mode === "live") {
      if (!validateLive()) return;
      setIsSubmitting(true);
      try {
        const res = await generateInstallUrl({
          installationUrl: liveValues.installationUrl.trim(),
          secret: liveValues.secret,
          userId,
          userName: displayName,
        });
        onSuccess();
        window.location.href = res.installUrl;
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Failed to generate install URL",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!validateDev()) return;
    setIsSubmitting(true);
    try {
      const res = await generateInstallUrl({
        store: devValues.store.trim(),
        clientId: devValues.clientId.trim(),
        secret: devValues.secret,
        scopes: devValues.scopes.trim(),
        appName: devValues.appName.trim() || undefined,
        userId,
        userName: displayName,
      });
      onSuccess();
      window.location.href = res.installUrl;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to generate install URL",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab: Live Store | Dev Store */}
      <div className="flex rounded-lg border border-gray-600 bg-[#0d1213] p-1">
        <button
          type="button"
          onClick={() => setMode("live")}
          className={cn(
            "flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
            mode === "live"
              ? "bg-shopify-green text-white"
              : "text-white/70 hover:text-white",
          )}
        >
          Live Store
        </button>
        <button
          type="button"
          onClick={() => setMode("dev")}
          className={cn(
            "flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
            mode === "dev"
              ? "bg-shopify-green text-white"
              : "text-white/70 hover:text-white",
          )}
        >
          Dev Store
        </button>
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
          <p className="text-sm text-red-500">{submitError}</p>
        </div>
      )}

      {mode === "live" ? (
        <div className="space-y-5">
          <FormInput
            label="Shopify Installation URL"
            name="installationUrl"
            value={liveValues.installationUrl}
            onChange={(v) => {
              setLiveValues((prev) => ({ ...prev, installationUrl: v }));
              setLiveErrors((prev) => ({ ...prev, installationUrl: undefined }));
            }}
            placeholder="Paste from Partners Dashboard"
            required
            error={liveErrors.installationUrl}
          />
          <FormInput
            label="Client Secret"
            name="secret"
            type="password"
            value={liveValues.secret}
            onChange={(v) => {
              setLiveValues((prev) => ({ ...prev, secret: v }));
              setLiveErrors((prev) => ({ ...prev, secret: undefined }));
            }}
            placeholder="From app credentials"
            required
            showToggle
            error={liveErrors.secret}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          <FormInput
            label="Store"
            name="store"
            value={devValues.store}
            onChange={(v) => {
              setDevValues((prev) => ({ ...prev, store: v }));
              setDevErrors((prev) => ({ ...prev, store: undefined }));
            }}
            placeholder="e.g. my-dev-store"
            required
            error={devErrors.store}
          />
          <FormInput
            label="App name"
            name="appName"
            value={devValues.appName}
            onChange={(v) => setDevValues((prev) => ({ ...prev, appName: v }))}
            placeholder="Optional"
          />
          <FormInput
            label="Client ID"
            name="clientId"
            value={devValues.clientId}
            onChange={(v) => {
              setDevValues((prev) => ({ ...prev, clientId: v }));
              setDevErrors((prev) => ({ ...prev, clientId: undefined }));
            }}
            placeholder="From Shopify Partners dashboard"
            required
            error={devErrors.clientId}
          />
          <FormInput
            label="Client Secret"
            name="secret"
            type="password"
            value={devValues.secret}
            onChange={(v) => {
              setDevValues((prev) => ({ ...prev, secret: v }));
              setDevErrors((prev) => ({ ...prev, secret: undefined }));
            }}
            placeholder="From app credentials"
            required
            showToggle
            error={devErrors.secret}
          />
          <div className="col-span-2">
            <FormTextarea
              label="Scopes"
              name="scopes"
              value={devValues.scopes}
              onChange={(v) => {
                setDevValues((prev) => ({ ...prev, scopes: v }));
                setDevErrors((prev) => ({ ...prev, scopes: undefined }));
              }}
              placeholder="read_products, write_products"
              required
              helpText="Comma-separated scopes"
              error={devErrors.scopes}
              rows={3}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-shopify-green px-6 py-3 font-semibold text-white transition-all hover:bg-shopify-green/90 disabled:opacity-50"
        >
          {isSubmitting ? "Redirecting…" : "Generate Token"}
        </button>
      </div>
    </form>
  );
}
