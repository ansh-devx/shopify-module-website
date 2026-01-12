"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import CodeBlock from "@/components/code-block/CodeBlock";
import Button from "@/components/ui/Button";
import { AlertCircle, Lightbulb, Zap, CheckCircle } from "lucide-react";

export default function PackPricingChallenge() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Pack Pricing Challenge (Bar Raiser)
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          This is an advanced challenge that tests your understanding of pricing
          logic and Shopify Functions. Try to solve it with discounts first,
          then explore Functions when you&apos;re stuck.
        </p>
      </div>

      {/* Problem Statement */}
      <Card className="border-shopify-yellow/50 bg-shopify-yellow/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-shopify-yellow" />
            <CardTitle className="text-xl text-white">The Problem</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-white/80">
          <div>
            <h3 className="font-semibold text-white mb-2">
              Current Product Pricing
            </h3>
            <p>
              Product A has the following pricing:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside ml-4">
              <li>Original Price: Rs. 12,000</li>
              <li>Compare at Price: Rs. 12,000</li>
              <li>Current Price: Rs. 10,800 (10% sale discount)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              The New Requirement: Pack Feature
            </h3>
            <p>
              You need to implement pack purchasing options:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside ml-4">
              <li>
                <strong>Pack of 1:</strong> 10% discount (should maintain current
                sale price: Rs. 10,800)
              </li>
              <li>
                <strong>Pack of 2:</strong> 20% discount (Rs. 9,600 per unit, Rs.
                19,200 total)
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-shopify-red/50 bg-shopify-red/20 p-4">
            <h4 className="font-semibold text-white mb-2">The Challenge</h4>
            <p className="text-sm">
              The discount must be calculated from the <strong>Original Price
              (Rs. 12,000)</strong>, NOT the current sale price (Rs. 10,800). If
              you use a standard discount coupon:
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside ml-4">
              <li>
                Pack of 2 with 20% off would be: Rs. 10,800 - (20% of Rs. 10,800)
                = Rs. 8,640 per unit
              </li>
              <li>
                Total for 2 units: Rs. 17,280
              </li>
              <li>
                <strong>Problem:</strong> Customer gets both the 10% sale discount
                AND 20% pack discount (total ~28% off)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-2">
              Additional Requirements
            </h3>
            <ul className="space-y-1 list-disc list-inside ml-4">
              <li>
                Use a Product Metafield <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">enable_pack</code> (Boolean) to control which products have the pack feature
              </li>
              <li>
                The pack discount logic should only run for products where{" "}
                <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">enable_pack = true</code>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-shopify-green/50 bg-shopify-green/20 p-4">
            <h4 className="font-semibold text-white mb-2">Expected Results</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Pack of 1:</strong> 10% off Rs. 12,000 = Rs. 10,800 per
                unit (maintains current sale price)
              </p>
              <p>
                <strong>Pack of 2:</strong> 20% off Rs. 12,000 = Rs. 9,600 per
                unit, Rs. 19,200 total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hint */}
      {!showSolution && (
        <Card className="border-shopify-blue/50 bg-shopify-blue/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-shopify-blue" />
              <CardTitle className="text-xl text-white">Try This First</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-white/80">
            <p>
              Before jumping to Functions, try to solve this with Shopify
              Discounts:
            </p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li>
                Create automatic discounts for Pack of 1 (10% off) and Pack of 2
                (20% off)
              </li>
              <li>
                Set minimum quantity requirements
              </li>
              <li>
                Apply to specific products using the metafield
              </li>
            </ul>
            <p className="text-sm text-white/60 mt-4">
              <strong>Why this won&apos;t work:</strong> Standard discounts apply
              to the current sale price, not the original price. You&apos;ll see
              that customers get too much discount (both sale + pack discount).
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setShowSolution(true)}
                variant="outline"
                size="lg"
              >
                I&apos;m Stuck - Show Functions Solution
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution */}
      {showSolution && (
        <Card className="border-shopify-green/50 bg-shopify-green/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-shopify-green" />
              <CardTitle className="text-xl text-white">
                Shopify Functions Solution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-white/80">
            <div>
              <h3 className="font-semibold text-white mb-2">
                Why Shopify Functions?
              </h3>
              <p>
                Standard discounts can only apply to the current product price.
                To calculate discounts based on the <strong>original price</strong>
                (compare_at_price), you need Shopify Functions. Functions give you
                access to both <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">price</code> and{" "}
                <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">compare_at_price</code>, allowing
                you to apply logic to the original price.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">
                Which Function Type?
              </h3>
              <p>
                For this challenge, use a <strong>Discount Function</strong> (specifically{" "}
                <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">Product Discount</code>).
                This allows you to apply custom discount logic to products based
                on cart contents and product properties.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Setup Instructions</h3>
              <CodeBlock
                code={`# Initialize a new Shopify app
npm init @shopify/app@latest

# Follow the prompts:
# - Select "Start with extension only app"
# - Extension type: "Discount"
# - Language: JavaScript
# - Extension name: "pack-pricing" (or your choice)

cd project-name

# Generate the discount extension
npm run shopify app generate extension

# Select "Discount" when prompted

# Update types after modifying GraphQL query
npm run typegen`}
                language="bash"
                filename="terminal"
              />
              <p className="mt-4 text-sm text-white/60">
                <strong>Note:</strong> The <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">typegen</code> command updates
                the generated types to match your GraphQL query. Run it whenever
                you modify <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">input.graphql</code>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">
                Implementation Overview
              </h3>
              <p className="mb-4">
                Your Function needs to:
              </p>
              <ol className="space-y-2 list-decimal list-inside ml-4">
                <li>
                  Check if the product has the <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">enable_pack</code> metafield set to true
                </li>
                <li>
                  Get the quantity selected (Pack of 1 or Pack of 2)
                </li>
                <li>
                  Access the <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">compare_at_price</code> (original price)
                </li>
                <li>
                  Calculate discount based on original price, not current price
                </li>
                <li>
                  Apply 10% for Pack of 1, 20% for Pack of 2
                </li>
              </ol>
            </div>

            <div className="rounded-lg border border-shopify-teal/50 bg-shopify-teal/20 p-4">
              <h4 className="font-semibold text-white mb-2">
                💡 Key Implementation Tips
              </h4>
              <ul className="space-y-1 text-sm text-white/80 list-disc list-inside ml-4">
                <li>
                  Use <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">compareAtPrice</code> from the product variant in your GraphQL query
                </li>
                <li>
                  Check quantity from cart line items
                </li>
                <li>
                  Calculate discount percentage based on pack size (1 = 10%, 2 = 20%)
                </li>
                <li>
                  Apply discount to the compare_at_price, not the current price
                </li>
                <li>
                  Only apply to products where metafield <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">enable_pack</code> is true
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Learn More</h3>
              <p>
                For comprehensive documentation on Discount Functions:
              </p>
              <div className="mt-2">
                <a
                  href="https://shopify.dev/docs/api/functions/reference/product-discounts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shopify-blue hover:underline font-medium"
                >
                  Product Discount Functions Documentation →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

