"use client";

import FormInput from "../form/FormInput";
import { AppAccessTokenFormData } from "@/types/app-access-token";

interface StepProps {
  formData: AppAccessTokenFormData;
  updateFormData: (updates: Partial<AppAccessTokenFormData>) => void;
  getError: (fieldName: string) => string | undefined;
}

export default function Step5ConfigureDistribution({
  formData,
  updateFormData,
  getError,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-4">
        <p className="text-text-secondary">
          Install your app to a Shopify store:
        </p>

        <ol className="space-y-3 list-decimal list-inside text-text-secondary">
          <li>Go to "Home" from your app navigation</li>
          <li>Select "Distribution" on the right side</li>
          <li>Choose "Custom distribution (recommended)"</li>
          <li>Paste your store URL in the provided field</li>
          <li>Click "Generate installation link"</li>
          <li>Copy the generated link and open it in a new tab</li>
          <li>Select the store and click "Install app"</li>
          <li>Complete the installation process</li>
        </ol>
      </div>

      {/* Divider */}
      <div className="border-t border-accent/10 my-6" />

      {/* Form Input */}
      <FormInput
        label="Store URL"
        name="storeUrl"
        type="url"
        value={formData.storeUrl}
        onChange={(value) => updateFormData({ storeUrl: value })}
        placeholder="mystore.myshopify.com"
        required
        error={getError("storeUrl")}
        helpText="Enter the URL of the store where you installed the app"
      />
    </div>
  );
}

