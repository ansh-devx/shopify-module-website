import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function WorkshopSetup() {
  return (
    <ContentLayout
      title="Live Coding Workshop - Setup"
      description="Set up your development environment for the live coding workshop"
    >
      <div className="space-y-8">
        {/* IDE Setup */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">IDE Setup</h2>
          <p className="mt-4 text-lg text-gray-700">
            We recommend using Visual Studio Code (VS Code) as your IDE for
            Shopify theme development.
          </p>

          <div className="mt-6 rounded-lg border border-accent/10 bg-surface-1 p-6">
            <h3 className="text-xl font-semibold text-text-primary">
              Recommended VS Code Extensions
            </h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-accent">•</span>
                <span>
                  <strong>Shopify Liquid</strong> - Syntax highlighting and
                  snippets for Liquid
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-accent">•</span>
                <span>
                  <strong>Prettier</strong> - Code formatter
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-accent">•</span>
                <span>
                  <strong>GitLens</strong> - Enhanced Git integration
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Initiate Project */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Initiate Project with GitHub
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Set up your project with version control using GitHub.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Step 1: Create a GitHub Organization
          </h3>
          <p className="mt-2 text-gray-700">
            Create a GitHub organization to manage your Shopify projects.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Step 2: Create a Repository
          </h3>
          <p className="mt-2 text-gray-700">
            Create a new repository with a valid name for your theme.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Step 3: Clone the Skeleton Theme
          </h3>
          <p className="mt-2 text-gray-700">
            Clone the Shopify Skeleton Theme to get started quickly:
          </p>
          <CodeBlock
            code={`git clone https://github.com/shopify-quickstart/themex.git`}
            language="bash"
            filename="terminal"
          />
          <p className="mt-4 text-gray-700">
            Or use Shopify CLI to initialize a new theme:
          </p>

          <p className="mt-4 text-gray-700">For initializing a new project:</p>
          <CodeBlock
            code={`# Initialize a new Shopify theme
shopify theme init

# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/my-repo/my-repo-dev.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main`}
            language="bash"
            filename="terminal"
          />

          <div className="mt-4 rounded-lg border border-accent/10 bg-surface-1 p-4">
            <h4 className="font-semibold text-text-primary">shopify theme init</h4>
            <p className="mt-2 text-sm text-gray-700">
              Creates a new Shopify theme directory with the basic theme
              structure. This command scaffolds a fresh theme with default files
              and folders, ready for development.
            </p>
          </div>
        </section>

        {/* shopify theme dev */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            shopify theme dev
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Starts a local development server that syncs your theme files to a
            development store in real-time.
          </p>

          <CodeBlock
            code={`shopify theme dev --store your-store.myshopify.com`}
            language="bash"
            filename="terminal"
          />

          <div className="mt-4 rounded-lg border border-accent/10 bg-surface-1 p-4">
            <h4 className="font-semibold text-text-primary">shopify theme dev</h4>
            <p className="mt-2 text-sm text-gray-700">
              Starts a local development server that watches for file changes
              and automatically syncs them to your development store. Provides a
              preview URL for testing your theme without affecting the live
              store. Use{" "}
              <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
                --store
              </code>{" "}
              to specify which store to connect to.
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">
              💡 What happens when you run this command?
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• Starts a local development server</li>
              <li>• Watches for file changes</li>
              <li>• Automatically syncs changes to your store</li>
              <li>• Provides a preview URL for testing</li>
              <li>• Enables hot reload for instant updates</li>
            </ul>
          </div>
        </section>

        {/* Shopify CLI Commands Reference */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Shopify CLI Commands
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            For a complete list of all Shopify CLI commands and their options,
            visit the official documentation:
          </p>
          <div className="mt-4">
            <a
              href="https://shopify.dev/docs/themes/tools/cli/commands"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium"
            >
              Shopify CLI Commands Reference →
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
