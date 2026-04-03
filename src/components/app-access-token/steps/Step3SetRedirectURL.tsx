"use client";

import FormCheckbox from "../form/FormCheckbox";
import CopyableText from "../form/CopyableText";
import { AppAccessTokenFormData, REDIRECT_URL } from "@/types/app-access-token";
import { Info } from "lucide-react";

interface StepProps {
  formData: AppAccessTokenFormData;
  updateFormData: (updates: Partial<AppAccessTokenFormData>) => void;
  getError: (fieldName: string) => string | undefined;
}

export default function Step3SetRedirectURL({
  formData,
  updateFormData,
  getError,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-4">
        <p className="text-text-secondary">
          Configure the redirect URL for your app:
        </p>

        <ol className="space-y-3 list-decimal list-inside text-text-secondary">
          <li>In your app dashboard, scroll to the "App URL" section</li>
          <li>Enter the redirect URL shown below</li>
          <li>Click "Save" to update your app settings</li>
        </ol>
      </div>

      {/* Copyable Redirect URL */}
      <CopyableText text={REDIRECT_URL} label="Redirect URL" />

      {/* Divider */}
      <div className="border-t border-accent/10 my-6" />

      {/* Confirmation Checkbox */}
      <FormCheckbox
        label="I have entered the redirect URL and saved the settings"
        name="redirectUrlConfirmed"
        checked={formData.redirectUrlConfirmed}
        onChange={(checked) =>
          updateFormData({ redirectUrlConfirmed: checked })
        }
        required
        error={getError("redirectUrlConfirmed")}
      />
    </div>
  );
}
