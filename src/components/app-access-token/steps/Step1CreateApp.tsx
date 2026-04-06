"use client";

import FormInput from "../form/FormInput";
import ExternalLinkButton from "../form/ExternalLinkButton";
import { AppAccessTokenFormData } from "@/types/app-access-token";
import { PARTNERS_DASHBOARD_URL } from "@/types/app-access-token";

interface StepProps {
  formData: AppAccessTokenFormData;
  updateFormData: (updates: Partial<AppAccessTokenFormData>) => void;
  getError: (fieldName: string) => string | undefined;
}

export default function Step1CreateApp({
  formData,
  updateFormData,
  getError,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-4">
        <p className="text-text-secondary">
          Follow these steps to create your Shopify app:
        </p>

        <ol className="space-y-3 list-decimal list-inside text-text-secondary">
          <li>Click the button below to open Shopify Partners Dashboard</li>
          <li>Navigate to the "Apps" section in the left sidebar</li>
          <li>Click the "Create app" button in the top right corner</li>
          <li>Enter your app name and click "Create"</li>
        </ol>
      </div>

      {/* External Link Button */}
      <div>
        <ExternalLinkButton href={PARTNERS_DASHBOARD_URL}>
          Open Partners Dashboard
        </ExternalLinkButton>
      </div>

      {/* Divider */}
      <div className="border-t border-accent/10 my-6" />

      {/* Form Input */}
      <FormInput
        label="App Name"
        name="appName"
        value={formData.appName}
        onChange={(value) => updateFormData({ appName: value })}
        placeholder="e.g., My Awesome Shopify App"
        required
        autoFocus
        error={getError("appName")}
        helpText="Enter the name you used when creating your app (for your reference)"
      />
    </div>
  );
}
