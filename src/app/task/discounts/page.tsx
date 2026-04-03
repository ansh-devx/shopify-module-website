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
          <h2 className="text-3xl font-bold text-text-primary">
            Types of Discounts in Shopify
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify offers four main discount types. Understanding them helps you
            choose the right one for your needs.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Amount off Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Discount a fixed amount from specific products or variants.
                  Example: Rs. 500 off on selected products.
                </p>
                <p className="mt-3 text-sm text-text-tertiary">
                  <strong>Use when:</strong> You want to give a fixed rupee
                  discount on specific products
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Amount off Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Discount a fixed amount from the entire order total. Example:
                  Rs. 1,000 off on orders over Rs. 10,000.
                </p>
                <p className="mt-3 text-sm text-text-tertiary">
                  <strong>Use when:</strong> You want to give a fixed rupee
                  discount based on order total
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">Free Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Offer free shipping when conditions are met. Example: Free
                  shipping on orders over Rs. 5,000.
                </p>
                <p className="mt-3 text-sm text-text-tertiary">
                  <strong>Use when:</strong> You want to incentivize customers
                  with free shipping
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">BXGY (Buy X Get Y)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Buy a certain quantity, get another item or discount. Example:
                  Buy 2 Get 1 Free, Buy 3 Get 20% Off.
                </p>
                <p className="mt-3 text-sm text-text-tertiary">
                  <strong>Use when:</strong> You want to offer quantity-based
                  promotions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 For Your task</h4>
            <p className="mt-2 text-sm text-blue-800">
              You need to create an <strong>automatic discount</strong> that
              gives 20% off when customers buy 2 or more of a specific product.
              This should be an automatic discount, not a code. For percentage
              discounts like this, you can use <strong>Amount off Product</strong> with percentage option.
            </p>
          </div>
        </section>

        {/* Creating the task Discount */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Creating Your task Discount
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Follow these steps to create the 20% off on 2+ quantity discount:
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Navigate to Discounts
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    In your Shopify admin, go to <strong>Discounts</strong> in
                    the left sidebar.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Create Automatic Discount
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Click <strong>&quot;Create discount&quot;</strong> and
                    select <strong>&quot;Automatic discount&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Choose Discount Type
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Select <strong>&quot;Amount off Product&quot;</strong> and
                    choose <strong>&quot;Percentage&quot;</strong>, then set it to{" "}
                    <strong>20%</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Set Minimum Quantity
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Under <strong>&quot;Minimum requirements&quot;</strong>,
                    select{" "}
                    <strong>&quot;Minimum quantity of items&quot;</strong> and
                    set it to <strong>2</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Select Products
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Under <strong>&quot;Applies to&quot;</strong>, select{" "}
                    <strong>&quot;Specific products&quot;</strong> and choose
                    the product(s) that should receive this discount.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Save and Activate
                  </h3>
                  <p className="mt-2 text-text-secondary">
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
          <h2 className="text-3xl font-bold text-text-primary">
            Testing Your Discount
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            After creating the discount, test it to ensure it works correctly:
          </p>

          <div className="mt-6 rounded-lg border border-accent/10 bg-background p-6">
            <ol className="space-y-2 text-text-secondary list-decimal list-inside">
              <li>Add 1 item to cart - discount should NOT apply</li>
              <li>
                Add a second item (quantity 2 or more) - discount SHOULD apply
              </li>
              <li>Check the cart total to verify 20% is deducted</li>
              <li>Proceed to checkout to ensure the discount persists</li>
            </ol>
          </div>
        </section>

        {/* Discount Codes vs Automatic */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Discount Codes vs Automatic Discounts
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Automatic Discounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Applied automatically at checkout when conditions are met. No
                  code required from customers.
                </p>
                <p className="mt-3 text-sm text-text-tertiary">
                  <strong>Best for:</strong> Quantity-based discounts, customer
                  segments, order value discounts
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Discount Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Customers enter a code at checkout to apply the discount.
                  Requires code entry and sharing.
                </p>
                <p className="mt-3 text-sm text-text-tertiary">
                  <strong>Best for:</strong> Email campaigns, social media
                  promotions, one-time offers
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation on discounts:
          </p>
          <div className="mt-4">
            <a
              href="https://help.shopify.com/en/manual/discounts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium"
            >
              Shopify Discounts Documentation →
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
