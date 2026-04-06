import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Terminal, Zap, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Shopify CLI + Tailwind Setup - Shopify Learn",
  description:
    "Set up your development environment with Shopify CLI and integrate Tailwind CSS.",
};

export default function CLISetup() {
  return (
    <ContentLayout
      title="Shopify CLI + Tailwind Setup"
      description="Set up your development environment with Shopify CLI and integrate Tailwind CSS for modern theme development."
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            What is Shopify CLI?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify CLI is a command-line tool that helps you build Shopify
            themes and apps faster. It provides a local development environment,
            hot reload, and deployment tools.
          </p>
        </section>

        {/* Prerequisites */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Prerequisites</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-accent mt-0.5" />
              <div>
                <strong>Node.js</strong> (v18 or higher) -{" "}
                <a
                  href="https://nodejs.org"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download here
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-accent mt-0.5" />
              <div>
                <strong>Git</strong> -{" "}
                <a
                  href="https://git-scm.com"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download here
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-accent mt-0.5" />
              <div>
                <strong>Shopify Partner Account</strong> -{" "}
                <a
                  href="https://partners.shopify.com"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign up here
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Installing Shopify CLI
          </h2>
          <p className="mt-4 text-gray-700">
            Install Shopify CLI globally using npm:
          </p>
          <CodeBlock
            code="npm install -g @shopify/cli @shopify/theme"
            language="bash"
            filename="terminal"
          />
          <p className="mt-4 text-gray-700">Verify the installation:</p>
          <CodeBlock
            code="shopify version"
            language="bash"
            filename="terminal"
          />
        </section>

        {/* Creating a Theme */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Creating a New Theme
          </h2>
          <p className="mt-4 text-gray-700">
            Initialize a new theme using Dawn (Shopify's reference theme):
          </p>
          <CodeBlock
            code={`# Create a new theme
shopify theme init my-theme

# Navigate to the theme directory
cd my-theme

# Start the development server
shopify theme dev --store your-store.myshopify.com`}
            language="bash"
            filename="terminal"
          />
        </section>

        {/* Tailwind Setup */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Adding Tailwind CSS
          </h2>
          <p className="mt-4 text-gray-700">
            Integrate Tailwind CSS into your Shopify theme for utility-first
            styling:
          </p>

          <h3 className="mt-6 text-xl font-semibold">
            Step 1: Install Dependencies
          </h3>
          <CodeBlock
            code={`npm init -y
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-xl font-semibold">
            Step 2: Configure Tailwind
          </h3>
          <CodeBlock
            code={`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layout/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/**/*.liquid",
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#95bf47',
        'blue-400': '#006fbb',
      },
    },
  },
  plugins: [],
}`}
            language="javascript"
            filename="tailwind.config.js"
          />

          <h3 className="mt-6 text-xl font-semibold">
            Step 3: Create CSS Input File
          </h3>
          <CodeBlock
            code={`@tailwind base;
@tailwind components;
@tailwind utilities;`}
            language="css"
            filename="assets/tailwind.css"
          />

          <h3 className="mt-6 text-xl font-semibold">Step 4: Build Script</h3>
          <p className="mt-4 text-gray-700">
            Add build scripts to package.json:
          </p>
          <CodeBlock
            code={`{
  "scripts": {
    "build:css": "tailwindcss -i ./assets/tailwind.css -o ./assets/output.css --watch",
    "dev": "npm run build:css & shopify theme dev"
  }
}`}
            language="json"
            filename="package.json"
          />

          <h3 className="mt-6 text-xl font-semibold">
            Step 5: Include in Theme
          </h3>
          <p className="mt-4 text-gray-700">Add to your theme.liquid file:</p>
          <CodeBlock
            code={`{{ 'output.css' | asset_url | stylesheet_tag }}`}
            language="liquid"
            filename="layout/theme.liquid"
          />
        </section>

        {/* Common Commands */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Common CLI Commands
          </h2>
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono">
                  shopify theme dev
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Start local development server with hot reload
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono">
                  shopify theme push
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Upload your theme to Shopify</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono">
                  shopify theme pull
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Download theme files from Shopify
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono">
                  shopify theme check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Lint your theme for errors and best practices
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Always develop on a development store, never on production
              </li>
              <li>Use version control (Git) for your theme files</li>
              <li>
                Run{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  shopify theme check
                </code>{" "}
                before deploying
              </li>
              <li>
                Keep Tailwind's purge configuration updated for smaller CSS
                files
              </li>
              <li>
                Use environment variables for store-specific configurations
              </li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
