import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Smartphone, Code, DollarSign, Users } from "lucide-react";

export const metadata = {
  title: "Shopify Apps - Shopify Learn",
  description: "Learn how to build, deploy, and monetize Shopify apps.",
};

export default function ShopifyApps() {
  return (
    <ContentLayout
      title="Shopify Apps"
      description="Learn how to build, deploy, and monetize Shopify apps that extend the Shopify platform."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            What are Shopify Apps?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify apps extend the functionality of Shopify stores. They can
            add features, integrate with third-party services, and provide
            custom solutions for merchants.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Types of Apps</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-shopify-green" />
                <CardTitle className="mt-4 text-xl">Public Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Listed in the Shopify App Store, available to all merchants.
                  Can be free or paid.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-shopify-blue" />
                <CardTitle className="mt-4 text-xl">Custom Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built for a specific store or client. Not listed in the App
                  Store.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Creating Your First App
          </h2>
          <p className="mt-4 text-gray-700">
            Use Shopify CLI to scaffold a new app:
          </p>
          <CodeBlock
            code={`# Create a new app
npm init @shopify/app@latest

# Choose your tech stack:
# - Remix (recommended)
# - Node.js
# - PHP
# - Ruby

# Navigate to app directory
cd my-shopify-app

# Start development server
npm run dev`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">App Structure</h2>
          <CodeBlock
            code={`my-shopify-app/
├── app/                    # Remix app routes
│   ├── routes/
│   │   ├── app._index.tsx  # Main app page
│   │   └── webhooks.tsx    # Webhook handlers
│   └── shopify.server.ts   # Shopify API config
├── extensions/             # App extensions
│   ├── product-discount/
│   └── checkout-ui/
├── prisma/                 # Database schema
│   └── schema.prisma
├── public/
└── shopify.app.toml       # App configuration`}
            language="bash"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Authentication</h2>
          <p className="mt-4 text-gray-700">
            Shopify apps use OAuth 2.0 for authentication. The CLI handles this
            automatically:
          </p>
          <CodeBlock
            code={`// app/shopify.server.ts
import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["read_products", "write_products"],
  appUrl: process.env.SHOPIFY_APP_URL,
  restResources,
});

export default shopify;`}
            language="typescript"
            filename="shopify.server.ts"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Making API Calls</h2>
          <CodeBlock
            code={`// Get products using GraphQL
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  
  const response = await admin.graphql(\`
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            status
          }
        }
      }
    }
  \`);
  
  const data = await response.json();
  return json(data);
}`}
            language="typescript"
            filename="app.products.tsx"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">App Extensions</h2>
          <p className="mt-4 text-gray-700">
            Extend your app with UI components in different parts of Shopify:
          </p>
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin UI Extensions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Add custom blocks to product pages, order details, and more in
                  the admin.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Checkout UI Extensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Customize the checkout experience with custom fields and
                  components.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme App Extensions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Add app blocks to themes that merchants can customize.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Webhooks</h2>
          <CodeBlock
            code={`// Register webhooks
import { DeliveryMethod } from "@shopify/shopify-api";

await shopify.webhooks.register({
  shop,
  accessToken,
  topic: "PRODUCTS_CREATE",
  deliveryMethod: DeliveryMethod.Http,
  callbackUrl: "/webhooks",
});

// Handle webhook
export async function action({ request }) {
  const { topic, shop, session } = await authenticate.webhook(request);
  
  const payload = await request.json();
  
  switch (topic) {
    case "PRODUCTS_CREATE":
      console.log("Product created:", payload);
      break;
    case "ORDERS_CREATE":
      console.log("Order created:", payload);
      break;
  }
  
  return new Response();
}`}
            language="typescript"
            filename="webhooks.tsx"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Monetization</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-shopify-green" />
                <CardTitle className="mt-4 text-lg">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Monthly or annual recurring charges
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-shopify-blue" />
                <CardTitle className="mt-4 text-lg">One-time Charge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Single payment for features or services
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-shopify-purple" />
                <CardTitle className="mt-4 text-lg">Usage-based</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Charge based on usage metrics
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Deployment</h2>
          <CodeBlock
            code={`# Deploy to Shopify
shopify app deploy

# The app will be deployed to:
# - Shopify's infrastructure (for app logic)
# - Your chosen hosting (for custom backend)

# Common hosting options:
# - Vercel
# - Heroku
# - Railway
# - Fly.io`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Request only the API scopes you actually need</li>
              <li>Handle webhook retries and idempotency</li>
              <li>Implement proper error handling and logging</li>
              <li>Follow Shopify's app design guidelines</li>
              <li>Test thoroughly before submitting to App Store</li>
              <li>Provide excellent documentation and support</li>
              <li>Monitor app performance and user feedback</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
