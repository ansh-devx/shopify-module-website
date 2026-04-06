import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AdminWalkthroughTabs from "@/components/admin/AdminWalkthroughTabs";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  Palette,
} from "lucide-react";

export const metadata = {
  title: "Shopify Admin Walkthrough - Shopify Learn",
  description:
    "A practical walkthrough of the Shopify Admin: products, collections, orders, and settings.",
};

export default function StoreAdmin() {
  return (
    <ContentLayout
      title="Shopify Admin Walkthrough"
      description="Learn where everything lives in the Shopify Admin and how to navigate key sections."
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            The Shopify Admin is where you manage products, orders, customers,
            and store settings. This guide shows you where to find the most
            commonly used sections.
          </p>
        </section>

        {/* Main Sections */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Main Sections</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card hover>
              <CardHeader>
                <Package className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-xl">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Add, edit, and organize products. Manage pricing, inventory,
                  variants, and collections.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-blue-400" />
                <CardTitle className="mt-4 text-xl">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Process orders, manage fulfillment, handle returns, and track
                  shipments.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <Users className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-xl">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  View customer profiles, manage segments, and track customer
                  data.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <BarChart className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-xl">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Track sales, traffic, and performance with reports and
                  dashboards.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <Palette className="h-8 w-8 text-yellow-400" />
                <CardTitle className="mt-4 text-xl">Online Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Manage theme, pages, navigation, and content.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <Settings className="h-8 w-8 text-gray-700" />
                <CardTitle className="mt-4 text-xl">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Configure store settings, payments, shipping, and taxes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed walkthrough */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Detailed Walkthrough
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Explore specific sections with detailed explanations below.
          </p>

          <div className="mt-6 not-prose">
            <AdminWalkthroughTabs />
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="text-4xl font-bold text-text-primary">
            Navigating the Admin
          </h2>
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Left Sidebar</h3>
            <p className="text-gray-700">
              The main navigation is in the left sidebar. It provides quick
              access to all major sections. You can collapse it for more screen
              space.
            </p>

            <h3 className="text-xl font-semibold mt-6">Search Bar</h3>
            <p className="text-gray-700">
              Use the search bar (⌘K or Ctrl+K) to quickly find products,
              orders, customers, or navigate to any page in the admin.
            </p>

            <h3 className="text-xl font-semibold mt-6">Notifications</h3>
            <p className="text-gray-700">
              The bell icon shows notifications about your store, including new
              orders, inventory alerts, and updates.
            </p>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
