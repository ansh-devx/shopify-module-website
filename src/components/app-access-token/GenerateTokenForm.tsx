"use client";

import { useState } from "react";
import FormInput from "./form/FormInput";
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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GenerateTokenFormValues, string>>>({});

  const update = (updates: Partial<GenerateTokenFormValues>) => {
    setValues((prev) => ({ ...prev, ...updates }));
    setSubmitError(null);
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(updates) as (keyof GenerateTokenFormValues)[]) {
        delete next[key];
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const err: Partial<Record<keyof GenerateTokenFormValues, string>> = {};
    if (!values.store.trim()) err.store = "Store is required";
    if (!values.clientId.trim()) err.clientId = "Client ID is required";
    if (!values.secret.trim()) err.secret = "Secret is required";
    if (!values.scopes.trim()) err.scopes = "Scopes are required";
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
      setSubmitError(err instanceof Error ? err.message : "Failed to generate install URL");
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

      <FormInput
        label="Store"
        name="store"
        value={values.store}
        onChange={(v) => update({ store: v })}
        placeholder="mystore or mystore.myshopify.com"
        required
        error={fieldErrors.store}
      />
      <FormInput
        label="App name"
        name="appName"
        value={values.appName}
        onChange={(v) => update({ appName: v })}
        placeholder="Optional display name"
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
      <FormInput
        label="Scopes"
        name="scopes"
        value={values.scopes}
        onChange={(v) => update({ scopes: v })}
        placeholder="read_products,write_products"
        required
        helpText="Comma-separated scopes"
        error={fieldErrors.scopes}
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-shopify-green px-6 py-3 font-semibold text-white transition-all hover:bg-shopify-green/90 disabled:opacity-50"
        >
          {isSubmitting ? "Redirecting…" : "Generate and redirect to Shopify"}
        </button>
      </div>
    </form>
  );
}
