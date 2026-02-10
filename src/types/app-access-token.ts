/**
 * Form data structure for App Access Token wizard
 */
export interface AppAccessTokenFormData {
  // Step 1: Create Shopify App
  appName: string;

  // Step 2: Configure App Scopes
  scopes: string;

  // Step 3: Set Redirect URL
  redirectUrlConfirmed: boolean;

  // Step 4: Copy App Credentials
  clientId: string;
  clientSecret: string;

  // Step 5: Configure Distribution
  storeUrl: string;

  // Step 6: Select Access Token Type (can select multiple)
  apiTypes: string[];
}

/**
 * Wizard state management
 */
export interface WizardState {
  currentStep: number; // 1-6
  completedSteps: Set<number>;
  formData: AppAccessTokenFormData;
  isSubmitting: boolean;
  submitError: string | null;
}

/**
 * Step configuration
 */
export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
}

/**
 * Validation error structure
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Radio option for API type selection
 */
export interface RadioOption {
  value: string;
  label: string;
  description: string;
}

/**
 * Initial form data
 */
export const initialFormData: AppAccessTokenFormData = {
  appName: "",
  scopes: "",
  redirectUrlConfirmed: false,
  clientId: "",
  clientSecret: "",
  storeUrl: "",
  apiTypes: [],
};

/**
 * Step configurations
 */
export const STEPS: StepConfig[] = [
  { number: 1, title: "Create Shopify App", shortTitle: "Create" },
  { number: 2, title: "Configure API Scopes", shortTitle: "Scopes" },
  { number: 3, title: "Set Redirect URL", shortTitle: "Redirect" },
  { number: 4, title: "Copy App Credentials", shortTitle: "Creds" },
  { number: 5, title: "Install App to Store", shortTitle: "Install" },
  { number: 6, title: "Select API Type", shortTitle: "API Type" },
];

/**
 * API type options
 */
export const API_TYPE_OPTIONS: RadioOption[] = [
  {
    value: "storefront",
    label: "Storefront API",
    description:
      "For building custom storefronts and customer-facing experiences. Access product data, collections, and customer information.",
  },
  {
    value: "admin",
    label: "Admin API",
    description:
      "For managing store data, products, orders, and admin operations. Full access to store management features.",
  },
];

/**
 * Token list item from GET /tokens (backend API)
 */
export interface TokenListItemBackend {
  id: string;
  store: string;
  scopes: string;
  token: string;
  app_name: string;
  created_at: number;
}

/**
 * Redirect URL constant
 */
export const REDIRECT_URL = "https://your-app-domain.com/auth/callback";

/**
 * Shopify Partners Dashboard URL
 */
export const PARTNERS_DASHBOARD_URL =
  "https://dev.shopify.com/dashboard/129018938/apps";
