import { useState, useEffect } from "react";
import {
  AppAccessTokenFormData,
  ValidationErrors,
} from "@/types/app-access-token";

/**
 * Custom hook for form validation
 */
export function useFormValidation(
  formData: AppAccessTokenFormData,
  currentStep: number,
) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Validate a specific step
   */
  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        // Step 1: Create Shopify App
        if (!formData.appName.trim()) {
          newErrors.appName = "App name is required";
        } else if (formData.appName.trim().length < 3) {
          newErrors.appName = "App name must be at least 3 characters";
        }
        break;

      case 2:
        // Step 2: Configure App Scopes
        if (!formData.scopes.trim()) {
          newErrors.scopes = "Scopes are required";
        }
        break;

      case 3:
        // Step 3: Set Redirect URL
        if (!formData.redirectUrlConfirmed) {
          newErrors.redirectUrlConfirmed =
            "Please confirm you have set the redirect URL";
        }
        break;

      case 4:
        // Step 4: Copy App Credentials
        if (!formData.clientId.trim()) {
          newErrors.clientId = "Client ID is required";
        } else if (formData.clientId.trim().length < 10) {
          newErrors.clientId = "Client ID must be at least 10 characters";
        }

        if (!formData.clientSecret.trim()) {
          newErrors.clientSecret = "Client Secret is required";
        } else if (formData.clientSecret.trim().length < 10) {
          newErrors.clientSecret =
            "Client Secret must be at least 10 characters";
        }
        break;

      case 5:
        // Step 5: Configure Distribution
        if (!formData.storeUrl.trim()) {
          newErrors.storeUrl = "Store URL is required";
        } else {
          // Validate store URL format
          const storeUrlPattern =
            /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$|^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/;
          if (!storeUrlPattern.test(formData.storeUrl.trim())) {
            newErrors.storeUrl =
              "Please enter a valid store URL (e.g., mystore.myshopify.com)";
          }
        }
        break;

      case 6:
        // Step 6: Select API Types
        if (!formData.apiTypes || formData.apiTypes.length === 0) {
          newErrors.apiTypes = "Please select at least one API type";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Check if user can proceed to next step (without setting errors)
   */
  const canProceed = (): boolean => {
    const newErrors: ValidationErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.appName.trim() || formData.appName.trim().length < 3) {
          return false;
        }
        break;

      case 2:
        if (!formData.scopes.trim()) {
          return false;
        }
        break;

      case 3:
        if (!formData.redirectUrlConfirmed) {
          return false;
        }
        break;

      case 4:
        if (
          !formData.clientId.trim() ||
          formData.clientId.trim().length < 10 ||
          !formData.clientSecret.trim() ||
          formData.clientSecret.trim().length < 10
        ) {
          return false;
        }
        break;

      case 5:
        if (!formData.storeUrl.trim()) {
          return false;
        }
        const storeUrlPattern =
          /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$|^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/;
        if (!storeUrlPattern.test(formData.storeUrl.trim())) {
          return false;
        }
        break;

      case 6:
        if (!formData.apiTypes || formData.apiTypes.length === 0) {
          return false;
        }
        break;

      default:
        break;
    }

    return true;
  };

  /**
   * Clear errors when step changes
   */
  useEffect(() => {
    setErrors({});
  }, [currentStep]);

  /**
   * Get error for a specific field
   */
  const getError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  return {
    errors,
    validateStep,
    canProceed,
    getError,
  };
}
