"use client";

import { useState } from "react";
import ProgressIndicator from "./ProgressIndicator";
import NavigationButtons from "./NavigationButtons";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  AppAccessTokenFormData,
  initialFormData,
  STEPS,
} from "@/types/app-access-token";

// Step components (will be created next)
import Step1CreateApp from "./steps/Step1CreateApp";
import Step2ConfigureScopes from "./steps/Step2ConfigureScopes";
import Step3SetRedirectURL from "./steps/Step3SetRedirectURL";
import Step4CopyCredentials from "./steps/Step4CopyCredentials";
import Step5ConfigureDistribution from "./steps/Step5ConfigureDistribution";
import Step6SelectAPIType from "./steps/Step6SelectAPIType";

interface AppAccessTokenWizardProps {
  onSuccess?: () => void;
}

export default function AppAccessTokenWizard({
  onSuccess,
}: AppAccessTokenWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] =
    useState<AppAccessTokenFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { errors, validateStep, canProceed, getError } = useFormValidation(
    formData,
    currentStep,
  );

  /**
   * Update form data
   */
  const updateFormData = (updates: Partial<AppAccessTokenFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Handle next step
   */
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  /**
   * Handle previous step
   */
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Phase 2 - API call to backend
      const response = await fetch("/api/app-access-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate access token");
      }

      const data = await response.json();

      // Success! Call the onSuccess callback to close modal and refresh data
      console.log("Success:", data);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Check if user can proceed (using the hook's canProceed function)
   */
  const canUserProceed = canProceed();

  /**
   * Render current step
   */
  const renderStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      errors,
      getError,
    };

    switch (currentStep) {
      case 1:
        return <Step1CreateApp {...stepProps} />;
      case 2:
        return <Step2ConfigureScopes {...stepProps} />;
      case 3:
        return <Step3SetRedirectURL {...stepProps} />;
      case 4:
        return <Step4CopyCredentials {...stepProps} />;
      case 5:
        return <Step5ConfigureDistribution {...stepProps} />;
      case 6:
        return <Step6SelectAPIType {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
        steps={STEPS}
      />

      {/* Step Title */}
      <div className="border-b border-gray-600 pb-4">
        <h2 className="text-2xl font-semibold text-white">
          {STEPS[currentStep - 1]?.title}
        </h2>
      </div>

      {/* Error Banner */}
      {submitError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500 p-4">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}

      {/* Current Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={STEPS.length}
        canProceed={canUserProceed}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
