import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Zap, ShoppingCart, Truck, CreditCard } from "lucide-react";
import PackPricingChallenge from "@/components/task/PackPricingChallenge";

export const metadata = {
  title: "Shopify Functions - Shopify Learn",
  description:
    "Extend Shopify's backend with custom business logic using Functions.",
};

export default function ShopifyFunctions() {
  return (
    <ContentLayout
      title="Shopify Functions"
      description="Learn how to extend Shopify's backend logic with custom Functions for discounts, shipping, payments, and more."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            What are Shopify Functions?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify Functions allow you to customize the backend logic of
            Shopify without modifying core code. They run on Shopify's
            infrastructure and can modify checkout behavior, discounts,
            shipping, and payment options.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Types of Functions
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-shopify-green" />
                <CardTitle className="mt-4 text-xl">
                  Discount Functions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create custom discount logic based on cart contents, customer
                  data, or external APIs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-8 w-8 text-shopify-blue" />
                <CardTitle className="mt-4 text-xl">
                  Delivery Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Customize shipping options, rates, and delivery methods based
                  on custom logic.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CreditCard className="h-8 w-8 text-shopify-purple" />
                <CardTitle className="mt-4 text-xl">
                  Payment Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Show or hide payment methods based on cart value, customer
                  type, or location.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-shopify-teal" />
                <CardTitle className="mt-4 text-xl">
                  Cart & Checkout Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Validate cart contents and prevent checkout based on custom
                  business rules.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pack Pricing Challenge */}
        <PackPricingChallenge />

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Creating a Function
          </h2>
          <p className="mt-4 text-gray-700">
            Use Shopify CLI to create a function-only app. Here's the complete
            process:
          </p>
          <CodeBlock
            code={`# Initialize a new Shopify app
shopify app init

# You'll see interactive prompts:

? Your project name?
> my-discount-function

? Get started building your app:
  Start with Remix (recommended)
> Start with extension only app

? Type of extension?
> Discount

? Name your extension:
> volume-discount

? What would you like to work in?
> JavaScript

? Partner organization:
> Devxconsultancy Private Limited

✓ Created my-discount-function
✓ Created extension: volume-discount
✓ Installed dependencies

# Navigate to your app
cd my-discount-function

# Your function structure:
extensions/volume-discount/
├── src/
│   └── run.js          # Function logic
├── input.graphql       # GraphQL query for input data
└── shopify.extension.toml  # Extension configuration`}
            language="bash"
            filename="terminal"
          />

          <div className="mt-6 rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Key Selections:
            </h3>
            <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>App Type:</strong> Start with extension only app (select
                this for functions)
              </li>
              <li>
                <strong>Extension Type:</strong> Discount (unified API for
                product, order, and shipping discounts)
              </li>
              <li>
                <strong>Language:</strong> JavaScript
              </li>
              <li>
                <strong>Organization:</strong> Devxconsultancy Private Limited
              </li>
              <li>
                <strong>Extension Name:</strong> Use a descriptive name like
                "volume-discount" or "free-shipping"
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Example: Discount Function
          </h2>
          <CodeBlock
            code={`// extensions/discount/src/run.js
import { ProductDiscountSelectionStrategy } from '../generated/api';

/**
 * @typedef {import('../generated/api').Input} Input
 * @typedef {import('../generated/api').CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * @param {Input} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const candidates = [];

  // Apply 10% discount to products with "sale" tag
  for (const line of input.cart.lines) {
    if (line.merchandise.__typename !== "ProductVariant") {
      continue;
    }

    if (line.merchandise.product.hasAnyTag) {
      candidates.push({
        value: {
          percentage: {
            value: "10.0"
          }
        },
        targets: [{
          cartLine: {
            id: line.id
          }
        }],
        message: "10% off sale items!"
      });
    }
  }

  if (candidates.length === 0) {
    return { operations: [] };
  }

  return {
    operations: [{
      productDiscountsAdd: {
        candidates,
        selectionStrategy: ProductDiscountSelectionStrategy.First
      }
    }]
  };
}`}
            language="javascript"
            filename="run.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            GraphQL Input Query
          </h2>
          <p className="mt-4 text-gray-700">
            Define what data your function needs from Shopify:
          </p>
          <CodeBlock
            code={`query Input {
  cart {
    lines {
      id
      merchandise {
        __typename
        ... on ProductVariant {
          id
          product {
            hasAnyTag(tags: ["sale"])
          }
        }
      }
    }
  }
}`}
            language="graphql"
            filename="run.graphql"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Testing Functions
          </h2>
          <CodeBlock
            code={`# Run function locally
shopify app function run

# Deploy function
shopify app deploy

# View function logs
shopify app function logs`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Example: Checkout Validation
          </h2>
          <CodeBlock
            code={`// Prevent checkout if cart total is less than Rs. 5,000
export default (input) => {
  const cartTotal = input.cart.cost.totalAmount.amount;
  const minimumAmount = 500000; // Amount in cents (Rs. 5,000 = 500,000 cents)

  if (cartTotal < minimumAmount) {
    return {
      errors: [
        {
          localizedMessage: \`Minimum order amount is Rs. 5,000\`,
          target: "cart"
        }
      ]
    };
  }

  return { errors: [] };
};`}
            language="javascript"
            filename="validation.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-shopify-purple/20 bg-shopify-purple/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Keep functions fast - they run on every cart update</li>
              <li>Request only the data you need in GraphQL queries</li>
              <li>Test thoroughly before deploying to production</li>
              <li>Use meaningful error messages for validation functions</li>
              <li>Monitor function performance and logs</li>
              <li>Consider edge cases and error handling</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
