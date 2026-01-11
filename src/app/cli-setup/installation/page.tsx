import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function CLIInstallation() {
  return (
    <ContentLayout
      title="Install Shopify CLI"
      description="Install and verify Shopify CLI on your system"
    >
      <div className="space-y-8">
        {/* Installation */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Installation</h2>
          <p className="mt-4 text-lg text-gray-700">
            Install Shopify CLI using Homebrew with these two commands:
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Step 1: Add Shopify Tap</h3>
          <CodeBlock
            code={`brew tap shopify/shopify`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Step 2: Install Shopify CLI</h3>
          <CodeBlock
            code={`brew install shopify-cli`}
            language="bash"
            filename="terminal"
          />
        </section>

        {/* Verify Installation */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Verify Installation</h2>
          <p className="mt-4 text-lg text-gray-700">
            Check that Shopify CLI was installed correctly:
          </p>

          <CodeBlock
            code={`shopify version`}
            language="bash"
            filename="terminal"
          />

          <p className="mt-4 text-gray-700">
            You should see the version number of Shopify CLI displayed in your terminal.
          </p>
        </section>
      </div>
    </ContentLayout>
  );
}

