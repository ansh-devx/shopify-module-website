"use client";

import FormInput from "../form/FormInput";
import { AppAccessTokenFormData } from "@/types/app-access-token";
import { AlertTriangle } from "lucide-react";

interface StepProps {
  formData: AppAccessTokenFormData;
  updateFormData: (updates: Partial<AppAccessTokenFormData>) => void;
  getError: (fieldName: string) => string | undefined;
}

export default function Step4CopyCredentials({
  formData,
  updateFormData,
  getError,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-4">
        <p className="text-white/80">
          Copy your app credentials from the Shopify Partners Dashboard:
        </p>

        <ol className="space-y-3 list-decimal list-inside text-white/70">
          <li>
            In your app dashboard, click "Settings" in the left navigation
          </li>
          <li>Scroll to the "Client credentials" section</li>
          <li>Copy the Client ID and Client Secret</li>
        </ol>
      </div>

      {/* Form Inputs */}
      <div className="space-y-4">
        <FormInput
          label="Client ID"
          name="clientId"
          value={formData.clientId}
          onChange={(value) => updateFormData({ clientId: value })}
          placeholder="Enter your Client ID"
          required
          error={getError("clientId")}
        />

        <FormInput
          label="Client Secret"
          name="clientSecret"
          type="password"
          value={formData.clientSecret}
          onChange={(value) => updateFormData({ clientSecret: value })}
          placeholder="Enter your Client Secret"
          required
          showToggle
          error={getError("clientSecret")}
        />
      </div>
    </div>
  );
}
