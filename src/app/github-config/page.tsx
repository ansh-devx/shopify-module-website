import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent } from "@/components/ui/Card";
import { Github, Download, Upload, GitBranch } from "lucide-react";

export const metadata = {
  title: "GitHub Configuration - Shopify Learn",
  description:
    "Version control your Shopify theme using GitHub and best practices.",
};

export default function GitHubConfig() {
  return (
    <ContentLayout
      title="GitHub Configuration"
      description="Learn how to version control your Shopify theme using GitHub for better collaboration and deployment."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Why Use Version Control?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Version control with Git and GitHub allows you to track changes,
            collaborate with team members, and maintain a history of your theme
            development. It's essential for professional development.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Download Theme from Shopify
          </h2>
          <p className="mt-4 text-gray-700">
            You can download your theme in two ways:
          </p>

          <h3 className="mt-6 text-xl font-semibold">
            Method 1: Using Shopify CLI
          </h3>
          <CodeBlock
            code={`# Pull theme from Shopify
shopify theme pull --store your-store.myshopify.com

# Or pull a specific theme
shopify theme pull --theme-id 123456789`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-xl font-semibold">
            Method 2: Download as ZIP
          </h3>
          <ol className="mt-4 list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to your Shopify Admin → Online Store → Themes</li>
            <li>Find your theme and click the "Actions" button</li>
            <li>Select "Download theme file"</li>
            <li>Extract the ZIP file to your local directory</li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Initialize Git Repository
          </h2>
          <CodeBlock
            code={`# Navigate to your theme directory
cd my-theme

# Initialize Git
git init

# Create .gitignore file
cat > .gitignore << EOF
node_modules/
.DS_Store
*.log
.env
config/settings_data.json
EOF

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Shopify theme setup"`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Connect to GitHub
          </h2>
          <CodeBlock
            code={`# Create a new repository on GitHub first, then:

# Add remote origin
git remote add origin https://github.com/yourusername/your-theme.git

# Push to GitHub
git branch -M main
git push -u origin main`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Branching Strategy
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <GitBranch className="h-8 w-8 text-shopify-green mb-4" />
                <h3 className="text-lg font-semibold">main</h3>
                <p className="mt-2 text-gray-600">
                  Production-ready code. Always stable.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <GitBranch className="h-8 w-8 text-shopify-blue mb-4" />
                <h3 className="text-lg font-semibold">development</h3>
                <p className="mt-2 text-gray-600">Active development branch.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <GitBranch className="h-8 w-8 text-shopify-purple mb-4" />
                <h3 className="text-lg font-semibold">feature/*</h3>
                <p className="mt-2 text-gray-600">
                  New features and experiments.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <GitBranch className="h-8 w-8 text-shopify-red mb-4" />
                <h3 className="text-lg font-semibold">hotfix/*</h3>
                <p className="mt-2 text-gray-600">Urgent production fixes.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Common Workflow</h2>
          <CodeBlock
            code={`# Create a new feature branch
git checkout -b feature/new-homepage

# Make changes and commit
git add .
git commit -m "Add new homepage section"

# Push to GitHub
git push origin feature/new-homepage

# Create Pull Request on GitHub
# After review and approval, merge to main

# Switch back to main and pull latest
git checkout main
git pull origin main`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            GitHub Actions for Deployment
          </h2>
          <p className="mt-4 text-gray-700">
            Automate theme deployment with GitHub Actions:
          </p>
          <CodeBlock
            code={`name: Deploy Theme

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Shopify CLI
        run: npm install -g @shopify/cli @shopify/theme
      
      - name: Deploy to Shopify
        env:
          SHOPIFY_CLI_THEME_TOKEN: \${{ secrets.SHOPIFY_CLI_THEME_TOKEN }}
          SHOPIFY_STORE: \${{ secrets.SHOPIFY_STORE }}
        run: shopify theme push --store \$SHOPIFY_STORE`}
            language="yaml"
            filename=".github/workflows/deploy.yml"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-shopify-blue/20 bg-shopify-blue/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Never commit sensitive data (API keys, passwords)</li>
              <li>Use meaningful commit messages</li>
              <li>Keep commits small and focused</li>
              <li>Always pull before pushing to avoid conflicts</li>
              <li>Use .gitignore to exclude unnecessary files</li>
              <li>Review changes before committing</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
