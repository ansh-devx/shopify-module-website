"use client";

import FormCheckboxGroup from "../form/FormCheckboxGroup";
import {
  AppAccessTokenFormData,
  API_TYPE_OPTIONS,
} from "@/types/app-access-token";

interface StepProps {
  formData: AppAccessTokenFormData;
  updateFormData: (updates: Partial<AppAccessTokenFormData>) => void;
  getError: (fieldName: string) => string | undefined;
}

export default function Step6SelectAPIType({
  formData,
  updateFormData,
  getError,
}: StepProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-4">
        <p className="text-white/80">
          Choose which Shopify APIs you want to generate access tokens for (you
          can select multiple):
        </p>
      </div>

      {/* Checkbox Group */}
      <FormCheckboxGroup
        label="API Types"
        name="apiTypes"
        values={formData.apiTypes}
        onChange={(values) => updateFormData({ apiTypes: values })}
        options={API_TYPE_OPTIONS}
        required
        error={getError("apiTypes")}
      />
    </div>
  );
}
