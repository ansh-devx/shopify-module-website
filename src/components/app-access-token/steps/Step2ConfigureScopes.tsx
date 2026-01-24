"use client";

import FormTextarea from "../form/FormTextarea";
import { AppAccessTokenFormData } from "@/types/app-access-token";
import { Info } from "lucide-react";

interface StepProps {
  formData: AppAccessTokenFormData;
  updateFormData: (updates: Partial<AppAccessTokenFormData>) => void;
  getError: (fieldName: string) => string | undefined;
}

export default function Step2ConfigureScopes({
  formData,
  updateFormData,
  getError,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-4">
        <p className="text-white/80">
          Configure the API access scopes for your app:
        </p>

        <ol className="space-y-3 list-decimal list-inside text-white/70">
          <li>In your app dashboard, scroll down to "API access scopes"</li>
          <li>
            Select the scopes your app needs (e.g., read_products, write_orders)
          </li>
          <li>Copy the selected scopes and paste them below</li>
        </ol>
      </div>

      {/* Form Textarea */}
      <FormTextarea
        label="Selected Scopes"
        name="scopes"
        value={formData.scopes}
        onChange={(value) => updateFormData({ scopes: value })}
        placeholder="e.g., read_products, write_orders, read_customers"
        required
        rows={6}
        error={getError("scopes")}
        helpText="Paste the scopes you selected, separated by commas"
      />
    </div>
  );
}

