import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function CLIGettingStarted() {
  return (
    <ContentLayout
      title="Getting Started with Shopify CLI"
      description="Learn how to authenticate and connect to your Shopify store"
    >
      <div className="space-y-8">
        {/* Login to Shopify */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Login to Shopify</h2>
          <p className="mt-4 text-lg text-gray-700">
            Authenticate with your Shopify Partner account to start using Shopify CLI:
          </p>

          <CodeBlock
            code={`shopify auth login`}
            language="bash"
            filename="terminal"
          />

          <p className="mt-4 text-gray-700">
            This command will open a browser window where you can log in to your Shopify Partner account.
          </p>
        </section>

        {/* Connect to a Store */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Connect to a Store</h2>
          <p className="mt-4 text-lg text-gray-700">
            Start a local development server and connect to your Shopify store:
          </p>

          <CodeBlock
            code={`shopify theme dev --store your-store.myshopify.com`}
            language="bash"
            filename="terminal"
          />

          <p className="mt-4 text-gray-700">
            Replace <code className="rounded bg-gray-100 px-2 py-1 text-sm">your-store.myshopify.com</code> with your actual store URL.
          </p>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 Pro Tip</h4>
            <p className="mt-2 text-sm text-blue-800">
              The <code className="rounded bg-blue-100 px-2 py-1">shopify theme dev</code> command starts a local development server 
              that watches for changes in your theme files and automatically syncs them to your store.
            </p>
          </div>
        </section>

        {/* What's Next */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What's Next?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Now that you have Shopify CLI set up, you're ready to:
          </p>

          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Create and develop Shopify themes locally</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Build custom Shopify apps</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Test changes in real-time with hot reload</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Deploy themes to your store</span>
            </li>
          </ul>
        </section>
      </div>
    </ContentLayout>
  );
}

