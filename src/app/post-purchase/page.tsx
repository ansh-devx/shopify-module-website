import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, Truck, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Post Purchase & Shopify Flow - Shopify Learn",
  description:
    "Understand order processing, Shopify Flow, and post-purchase automation.",
};

export default function PostPurchase() {
  return (
    <ContentLayout
      title="Post Purchase & Shopify Flow"
      description="Learn about order lifecycle, post-purchase experiences, and automation with Shopify Flow."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Order Lifecycle</h2>
          <p className="mt-4 text-lg text-gray-700">
            Understanding the order lifecycle is crucial for building
            post-purchase experiences and automations in Shopify.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-lg">1. Order Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  Customer completes checkout and order is created
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-blue-400" />
                <CardTitle className="mt-4 text-lg">2. Fulfillment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  Items are picked, packed, and prepared for shipping
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-lg">3. Shipped</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  Order is shipped and tracking info is provided
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-lg">4. Delivered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  Customer receives the order
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary">Shopify Flow</h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify Flow is a powerful automation tool that lets you build
            workflows to automate tasks and processes in your store.
          </p>
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Key Concepts</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-accent/10 p-4">
                <h4 className="font-semibold text-accent">Triggers</h4>
                <p className="mt-2 text-sm text-text-secondary">
                  Events that start a workflow (e.g., order created, product
                  updated)
                </p>
              </div>
              <div className="rounded-lg border border-accent/10 p-4">
                <h4 className="font-semibold text-blue-400">Conditions</h4>
                <p className="mt-2 text-sm text-text-secondary">
                  Rules that determine if actions should run
                </p>
              </div>
              <div className="rounded-lg border border-accent/10 p-4">
                <h4 className="font-semibold text-accent">Actions</h4>
                <p className="mt-2 text-sm text-text-secondary">
                  Tasks performed when conditions are met
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            How to Create a Shopify Flow
          </h2>
          <p className="mt-4 text-gray-700">
            Follow these steps to create your first automation workflow:
          </p>
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Access Shopify Flow
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    In your Shopify admin, go to{" "}
                    <strong>
                      Settings → Apps and sales channels → Shopify Flow
                    </strong>
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
                    Create a New Workflow
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Click <strong>&quot;Create workflow&quot;</strong> button
                  </p>
                  <p className="mt-1 text-sm text-text-tertiary">
                    You can start from a template or build from scratch
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
                    Select a Trigger
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Choose what event starts your workflow:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-text-tertiary">
                    <li>Order created</li>
                    <li>Order paid</li>
                    <li>Order fulfilled</li>
                    <li>Product created or updated</li>
                    <li>Customer created</li>
                    <li>Inventory quantity changed</li>
                  </ul>
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
                    Add Conditions (Optional)
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Set rules to filter when actions should run:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-text-tertiary">
                    <li>Order total is greater than Rs. 50,000</li>
                    <li>Customer has a specific tag</li>
                    <li>Product is in a certain collection</li>
                    <li>Inventory level is below threshold</li>
                  </ul>
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
                    Add Actions
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Choose what happens when conditions are met:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-text-tertiary">
                    <li>Send email notification</li>
                    <li>Add tags to customer or order</li>
                    <li>Send Slack message</li>
                    <li>Update inventory</li>
                    <li>Create a task</li>
                    <li>Call a webhook (for custom integrations)</li>
                  </ul>
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
                    Test and Activate
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Click <strong>&quot;Turn on workflow&quot;</strong> to
                    activate
                  </p>
                  <p className="mt-1 text-sm text-text-tertiary">
                    Monitor the workflow runs in the Flow dashboard to ensure
                    it&apos;s working correctly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Common Flow Examples
          </h2>
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  High-Value Order Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Trigger:</strong> Order created
                  </p>
                  <p>
                    <strong>Condition:</strong> Order total &gt; Rs. 50,000
                  </p>
                  <p>
                    <strong>Action:</strong> Send email to manager
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Auto-Tag VIP Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Trigger:</strong> Order created
                  </p>
                  <p>
                    <strong>Condition:</strong> Customer lifetime value &gt; Rs.
                    1,00,000
                  </p>
                  <p>
                    <strong>Action:</strong> Add &quot;VIP&quot; tag to customer
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Trigger:</strong> Product variant updated
                  </p>
                  <p>
                    <strong>Condition:</strong> Inventory quantity &lt; 10
                  </p>
                  <p>
                    <strong>Action:</strong> Send Slack notification
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Post-Purchase Automation Ideas
          </h2>
          <p className="mt-4 text-gray-700">
            Use Shopify Flow to automate post-purchase tasks:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                Order Confirmation
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Send personalized thank you emails with order details and
                estimated delivery dates
              </p>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                Fulfillment Notifications
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Automatically notify customers when their order is packed and
                shipped
              </p>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                Review Requests
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Send review requests 7 days after delivery to gather customer
                feedback
              </p>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <h3 className="text-lg font-semibold text-white">
                Loyalty Programs
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Award points or discounts to customers based on purchase history
              </p>
            </div>
          </div>
        </section>

        {/* task Requirement */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Task: Cancel Order Automation
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            For your task, you need to create a Shopify Flow that automatically
            cancels orders when the customer email contains{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
              @devxlabs.ai
            </code>{" "}
            and sends a Slack notification.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Create New Workflow
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Go to{" "}
                    <strong>
                      Settings → Apps and sales channels → Shopify Flow
                    </strong>{" "}
                    and click <strong>&quot;Create workflow&quot;</strong>.
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
                    Set Trigger
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Select <strong>&quot;Order created&quot;</strong> as the
                    trigger. This will start the workflow when an order is
                    created.
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
                    Add Condition
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Add a condition:{" "}
                    <strong>
                      &quot;Order customer email contains @devxlabs.ai&quot;
                    </strong>
                    .
                  </p>
                  <p className="mt-2 text-sm text-text-tertiary">
                    In Flow, you&apos;ll find this under Order → Customer email
                    → Contains.
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
                    Add Cancel Order Action
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Add an action: <strong>&quot;Cancel order&quot;</strong>.
                    This will automatically cancel orders that meet the
                    condition.
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
                    Add Slack Notification
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Add another action:{" "}
                    <strong>&quot;Send Slack message&quot;</strong> with the
                    message <strong>&quot;Your Order is cancelled&quot;</strong>
                    .
                  </p>
                  <p className="mt-2 text-sm text-text-tertiary">
                    <strong>Note:</strong> You&apos;ll need to connect your
                    Slack workspace first. Go to Flow settings to add the Slack
                    integration.
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
                    Activate Workflow
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Click <strong>&quot;Turn on workflow&quot;</strong> to
                    activate it. Test it by placing an order with an email
                    containing{" "}
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      @devxlabs.ai
                    </code>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 Workflow Summary</h4>
            <div className="mt-2 space-y-1 text-sm text-blue-800">
              <p>
                <strong>Trigger:</strong> Order created
              </p>
              <p>
                <strong>Condition:</strong> Order customer email contains
                @devxlabs.ai
              </p>
              <p>
                <strong>Actions:</strong>
              </p>
              <ul className="ml-4 list-disc list-inside">
                <li>Cancel the order</li>
                <li>
                  Send Slack notification: &quot;Your Order is cancelled&quot;
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-text-primary">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-accent/20 bg-accent/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Always test workflows in a development store first</li>
              <li>Use clear naming conventions for Flow workflows</li>
              <li>Monitor webhook delivery and handle failures gracefully</li>
              <li>Keep customers informed with timely notifications</li>
              <li>Provide tracking information as soon as available</li>
              <li>Consider time zones when scheduling automated actions</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
