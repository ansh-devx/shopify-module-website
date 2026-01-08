import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, Truck, CheckCircle, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Post Purchase & Shopify Flow - Shopify Learn",
  description: "Understand order processing, Shopify Flow, and post-purchase automation.",
};

export default function PostPurchase() {
  return (
    <ContentLayout
      title="Post Purchase & Shopify Flow"
      description="Learn about order lifecycle, post-purchase experiences, and automation with Shopify Flow."
      previousPage={{ title: "Shopify Functions", href: "/shopify-functions" }}
      nextPage={{ title: "Shopify Apps", href: "/shopify-apps" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Order Lifecycle</h2>
          <p className="mt-4 text-lg text-gray-700">
            Understanding the order lifecycle is crucial for building post-purchase experiences 
            and automations in Shopify.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-shopify-green" />
                <CardTitle className="mt-4 text-lg">1. Order Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Customer completes checkout and order is created
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-shopify-blue" />
                <CardTitle className="mt-4 text-lg">2. Fulfillment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Items are picked, packed, and prepared for shipping
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-8 w-8 text-shopify-purple" />
                <CardTitle className="mt-4 text-lg">3. Shipped</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Order is shipped and tracking info is provided
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-shopify-teal" />
                <CardTitle className="mt-4 text-lg">4. Delivered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Customer receives the order
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Order Status API</h2>
          <p className="mt-4 text-gray-700">
            Access order information programmatically:
          </p>
          <CodeBlock
            code={`// GraphQL query to get order details
query getOrder($id: ID!) {
  order(id: $id) {
    id
    name
    email
    createdAt
    financialStatus
    fulfillmentStatus
    totalPrice
    lineItems(first: 10) {
      edges {
        node {
          title
          quantity
          variant {
            price
          }
        }
      }
    }
    shippingAddress {
      address1
      city
      province
      country
      zip
    }
  }
}`}
            language="graphql"
            filename="order-query.graphql"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Shopify Flow</h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify Flow is a powerful automation tool that lets you build workflows to automate 
            tasks and processes in your store.
          </p>
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Key Concepts</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-shopify-green">Triggers</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Events that start a workflow (e.g., order created, product updated)
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-shopify-blue">Conditions</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Rules that determine if actions should run
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-shopify-purple">Actions</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Tasks performed when conditions are met
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Common Flow Examples</h2>
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">High-Value Order Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Trigger:</strong> Order created</p>
                  <p><strong>Condition:</strong> Order total &gt; $500</p>
                  <p><strong>Action:</strong> Send email to manager</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Auto-Tag VIP Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Trigger:</strong> Order created</p>
                  <p><strong>Condition:</strong> Customer lifetime value &gt; $1000</p>
                  <p><strong>Action:</strong> Add "VIP" tag to customer</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Trigger:</strong> Product variant updated</p>
                  <p><strong>Condition:</strong> Inventory quantity &lt; 10</p>
                  <p><strong>Action:</strong> Send Slack notification</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Post-Purchase Extensions</h2>
          <p className="mt-4 text-gray-700">
            Create custom post-purchase experiences using Shopify's checkout extensions:
          </p>
          <CodeBlock
            code={`// Create a post-purchase extension
shopify app generate extension

// Select "Post-purchase UI"
// This allows you to show offers after checkout`}
            language="bash"
            filename="terminal"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Order Status Page Customization</h2>
          <CodeBlock
            code={`<!-- Customize order status page with Liquid -->
<div class="order-status">
  <h2>Thank you, {{ order.customer.first_name }}!</h2>
  <p>Order #{{ order.name }}</p>
  
  {% if order.fulfillment_status == 'fulfilled' %}
    <div class="tracking-info">
      <h3>Tracking Information</h3>
      {% for fulfillment in order.fulfillments %}
        <p>Tracking: {{ fulfillment.tracking_number }}</p>
        <a href="{{ fulfillment.tracking_url }}">Track Package</a>
      {% endfor %}
    </div>
  {% endif %}
  
  <div class="order-items">
    {% for line_item in order.line_items %}
      <div class="item">
        <img src="{{ line_item.image | img_url: '100x100' }}">
        <span>{{ line_item.title }}</span>
        <span>{{ line_item.quantity }} × {{ line_item.price | money }}</span>
      </div>
    {% endfor %}
  </div>
</div>`}
            language="liquid"
            filename="order-status.liquid"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Webhooks for Order Events</h2>
          <CodeBlock
            code={`// Subscribe to order webhooks
{
  "webhook": {
    "topic": "orders/create",
    "address": "https://your-app.com/webhooks/orders/create",
    "format": "json"
  }
}

// Available order webhooks:
// - orders/create
// - orders/updated
// - orders/paid
// - orders/cancelled
// - orders/fulfilled
// - fulfillments/create
// - fulfillments/update`}
            language="json"
            filename="webhooks.json"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-shopify-teal/20 bg-shopify-teal/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
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

