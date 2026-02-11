"use client";

import { useState } from "react";
import FormInput from "./form/FormInput";
import FormTextarea from "./form/FormTextarea";
import { generateInstallUrl } from "@/lib/tokenGeneratorApi";

export interface GenerateTokenFormValues {
  store: string;
  appName: string;
  clientId: string;
  secret: string;
  scopes: string;
}

const initialValues: GenerateTokenFormValues = {
  store: "",
  appName: "",
  clientId: "",
  secret: "",
  scopes: "",
};

/** Store: myshopify.com hostname or short store subdomain (no spaces) */
function isValidStore(store: string): boolean {
  const s = store.trim();
  if (s.length < 2 || s.length > 100) return false;
  if (/\s/.test(s)) return false;
  if (s.endsWith(".myshopify.com"))
    return /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.myshopify\.com$/.test(s);
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(s);
}

/** Client ID: non-empty, no spaces, reasonable length (Shopify IDs are long) */
function isValidClientId(clientId: string): boolean {
  const s = clientId.trim();
  return s.length >= 10 && s.length <= 256 && !/\s/.test(s);
}

/** Scopes: comma-separated, at least one scope token */
function isValidScopes(scopes: string): boolean {
  const s = scopes.trim();
  if (s.length < 3) return false;
  const parts = s
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 1 && parts.every((p) => /^[a-z_][a-z0-9_]*$/i.test(p));
}

interface GenerateTokenFormProps {
  userId: string;
  onSuccess: () => void;
}

export default function GenerateTokenForm({
  userId,
  onSuccess,
}: GenerateTokenFormProps) {
  const [values, setValues] = useState<GenerateTokenFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof GenerateTokenFormValues, string>>
  >({});

  const update = (updates: Partial<GenerateTokenFormValues>) => {
    setValues((prev) => ({ ...prev, ...updates }));
    setSubmitError(null);
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(
        updates,
      ) as (keyof GenerateTokenFormValues)[]) {
        delete next[key];
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const err: Partial<Record<keyof GenerateTokenFormValues, string>> = {};
    const store = values.store.trim();
    const clientId = values.clientId.trim();
    const secret = values.secret;
    const scopes = values.scopes.trim();

    if (!store) {
      err.store = "Store is required";
    } else if (!isValidStore(values.store)) {
      err.store =
        "Use a store subdomain (e.g. mystore) or full hostname (e.g. mystore.myshopify.com)";
    }
    if (!clientId) {
      err.clientId = "Client ID is required";
    } else if (!isValidClientId(values.clientId)) {
      err.clientId =
        "Client ID should be from the Shopify Partners dashboard (at least 10 characters)";
    }
    if (!secret) {
      err.secret = "Secret is required";
    }
    if (!scopes) {
      err.scopes = "Scopes are required";
    } else if (!isValidScopes(values.scopes)) {
      err.scopes =
        "Enter comma-separated scopes (e.g. read_products, write_products)";
    }

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await generateInstallUrl({
        store: values.store.trim(),
        appName: values.appName.trim() || undefined,
        clientId: values.clientId.trim(),
        secret: values.secret,
        scopes: values.scopes.trim(),
        userId,
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
      {submitError && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
          <p className="text-sm text-red-500">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <FormInput
          label="Store"
          name="store"
          value={values.store}
          onChange={(v) => update({ store: v })}
          placeholder="mystore.myshopify.com"
          required
          error={fieldErrors.store}
        />
        <FormInput
          label="App name"
          name="appName"
          value={values.appName}
          onChange={(v) => update({ appName: v })}
          placeholder="my-app"
        />
        <FormInput
          label="Client ID"
          name="clientId"
          value={values.clientId}
          onChange={(v) => update({ clientId: v })}
          placeholder="From Shopify Partners dashboard"
          required
          error={fieldErrors.clientId}
        />
        <FormInput
          label="Secret"
          name="secret"
          type="password"
          value={values.secret}
          onChange={(v) => update({ secret: v })}
          placeholder="Client secret from Partners dashboard"
          required
          showToggle
          error={fieldErrors.secret}
        />
        <div className="col-span-2">
          <FormTextarea
            label="Scopes"
            name="scopes"
            value={values.scopes}
            onChange={(v) => update({ scopes: v })}
            placeholder="read_products, write_products"
            required
            helpText="Comma-separated scopes"
            error={fieldErrors.scopes}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-shopify-green px-6 py-3 font-semibold text-white transition-all hover:bg-shopify-green/90 disabled:opacity-50"
        >
          {isSubmitting ? "Redirecting…" : "Generate"}
        </button>
      </div>
    </form>
  );
}
