"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepConfig } from "@/types/app-access-token";

interface ProgressIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
  steps: StepConfig[];
}

export default function ProgressIndicator({
  currentStep,
  completedSteps,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:block">
        <div className="flex justify-center">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.number);
              const isCurrent = currentStep === step.number;
              const isUpcoming = step.number > currentStep;

              return (
                <div key={step.number} className="flex items-center">
                  {/* Step Circle with Text Inside */}
                  <div className="relative group">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        "border-2 transition-all duration-300 font-semibold text-xs",
                        isCompleted &&
                          "bg-accent border-accent text-white",
                        isCurrent &&
                          "bg-accent border-accent text-white animate-pulse",
                        isUpcoming &&
                          "bg-background border-accent/10 text-text-secondary",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" strokeWidth={3} />
                      ) : (
                        <span className="text-[11px] font-bold leading-tight text-center px-1.5">
                          {step.shortTitle}
                        </span>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                        {step.title}
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-8 transition-colors duration-300",
                        step.number < currentStep
                          ? "bg-accent"
                          : "bg-gray-600",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical compact layout */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-semibold text-white">
            Step {currentStep} of {steps.length}
          </span>
          <span>•</span>
          <span>{steps[currentStep - 1]?.title}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full h-2 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
