import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "Discounts - Shopify Learn",
  description:
    "Learn how to create discounts in Shopify, including the task requirement: 20% off on 2+ quantity.",
};

export default function DiscountsPage() {
  return (
    <ContentLayout
      title="Discounts"
      description="Learn about discount types in Shopify and create the 20% off on 2+ quantity discount for your task"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            Discounts are a powerful way to offer promotions to customers. For
            your task, you need to create a discount that gives 20% off when
            customers buy 2 or more of a specific product.
          </p>
        </section>

        {/* Discount Types */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Types of Discounts in Shopify
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify offers several discount types. Understanding them helps you
            choose the right one for your needs.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Automatic Discounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Applied automatically at checkout when conditions are met. No
                  code required.
                </p>
                <p className="mt-3 text-sm text-white/60">
                  <strong>Examples:</strong> Buy X get Y, Percentage off, Fixed
                  amount off, Free shipping
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Discount Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Customers enter a code at checkout to apply the discount.
                  Requires code entry.
                </p>
                <p className="mt-3 text-sm text-white/60">
                  <strong>Examples:</strong> SUMMER20, WELCOME10, FREESHIP
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 For Your task</h4>
            <p className="mt-2 text-sm text-blue-800">
              You need to create an <strong>automatic discount</strong> that
              gives 20% off when customers buy 2 or more of a specific product.
              This should be an automatic discount, not a code.
            </p>
          </div>
        </section>

        {/* Creating the task Discount */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Creating Your task Discount
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Follow these steps to create the 20% off on 2+ quantity discount:
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Navigate to Discounts
                  </h3>
                  <p className="mt-2 text-white/80">
                    In your Shopify admin, go to <strong>Discounts</strong> in
                    the left sidebar.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Create Automatic Discount
                  </h3>
                  <p className="mt-2 text-white/80">
                    Click <strong>&quot;Create discount&quot;</strong> and
                    select <strong>&quot;Automatic discount&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Choose Discount Type
                  </h3>
                  <p className="mt-2 text-white/80">
                    Select <strong>&quot;Percentage off&quot;</strong> and set
                    it to <strong>20%</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Set Minimum Quantity
                  </h3>
                  <p className="mt-2 text-white/80">
                    Under <strong>&quot;Minimum requirements&quot;</strong>,
                    select{" "}
                    <strong>&quot;Minimum quantity of items&quot;</strong> and
                    set it to <strong>2</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Select Products
                  </h3>
                  <p className="mt-2 text-white/80">
                    Under <strong>&quot;Applies to&quot;</strong>, select{" "}
                    <strong>&quot;Specific products&quot;</strong> and choose
                    the product(s) that should receive this discount.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Save and Activate
                  </h3>
                  <p className="mt-2 text-white/80">
                    Give your discount a name (e.g., &quot;20% off on 2+
                    quantity&quot;) and click <strong>&quot;Save&quot;</strong>.
                    Make sure it&apos;s enabled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testing the Discount */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Testing Your Discount
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            After creating the discount, test it to ensure it works correctly:
          </p>

          <div className="mt-6 rounded-lg border border-[#24393d] bg-[#151d1e] p-6">
            <ol className="space-y-2 text-white/80 list-decimal list-inside">
              <li>Add 1 item to cart - discount should NOT apply</li>
              <li>
                Add a second item (quantity 2 or more) - discount SHOULD apply
              </li>
              <li>Check the cart total to verify 20% is deducted</li>
              <li>Proceed to checkout to ensure the discount persists</li>
            </ol>
          </div>
        </section>

        {/* Additional Discount Types */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Other Discount Types (Reference)
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify supports many discount types. Here are some common ones:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Buy X Get Y
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Buy a certain quantity, get another item or discount (e.g.,
                  Buy 2 Get 1 Free)
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Fixed Amount Off
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Discount a fixed amount (e.g., Rs. 500 off)
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Free Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Offer free shipping when conditions are met
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Customer-Specific
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Discounts for specific customer groups or segments
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation on discounts:
          </p>
          <div className="mt-4">
            <a
              href="https://help.shopify.com/en/manual/discounts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shopify-blue hover:underline font-medium"
            >
              Shopify Discounts Documentation →
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
