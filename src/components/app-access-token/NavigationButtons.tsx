"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-accent/10">
      {/* Previous Button */}
      {!isFirstStep && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="flex items-center gap-2 border-accent/10 text-white hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}

      {/* Spacer for first step */}
      {isFirstStep && <div />}

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className="flex items-center gap-2 ml-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Token...
            </>
          ) : (
            "Generate Access Token"
          )}
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2 ml-auto"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

