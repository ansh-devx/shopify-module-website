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
    "A practical walkthrough of the Shopify Admin: URL structure, products, collections, files, menus, analytics, discounts, and orders.",
};

export default function StoreAdmin() {
  return (
    <ContentLayout
      title="Shopify Admin Walkthrough"
      description="Learn where everything lives in the Shopify Admin and how to manage products, collections, content, discounts, analytics, and orders."
      previousPage={{
        title: "Partners Dashboard",
        href: "/partners-dashboard",
      }}
      nextPage={{ title: "CLI Setup", href: "/cli-setup" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            The Shopify Admin
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            The Shopify admin is your store&apos;s control center. It&apos;s
            where you manage products, orders, customers, and all aspects of
            your online business. The admin is accessible from any device and
            provides a powerful, intuitive interface.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            This page is a practical walkthrough of the most used areas in the
            admin, including where to find them in the left sidebar and what
            each section is used for.
          </p>
        </section>

        {/* URL structure */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Shopify Admin URL structure
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Admin URL</h3>
              <p className="mt-2 text-gray-700">
                The admin is usually accessed at:
              </p>
              <div className="mt-3 break-all rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-800 dark:bg-black dark:text-white">
                https://your-store-name.myshopify.com/admin
              </div>
              <p className="mt-3 text-gray-600">
                This is not your storefront URL. Customers won&apos;t browse
                this link—only staff (with permission) can log in.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                What is a myshopify.com URL?
              </h3>
              <p className="mt-2 text-gray-700">
                When you create a Shopify store, Shopify assigns a permanent URL
                like:
              </p>
              <div className="mt-3 break-all rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-800 dark:bg-black dark:text-white">
                https://urban-threads-store.myshopify.com
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li>
                  <span className="font-semibold">urban-threads-store</span> is
                  your unique store subdomain
                </li>
                <li>
                  <span className="font-semibold">.myshopify.com</span> is
                  Shopify&apos;s domain
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Main Sections */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Main Sections (at a glance)
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card hover>
              <CardHeader>
                <Package className="h-8 w-8 text-shopify-green" />
                <CardTitle className="mt-4 text-xl">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Add, edit, and organize products. Manage pricing, inventory,
                  variants, SEO, and collections.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-shopify-blue" />
                <CardTitle className="mt-4 text-xl">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Process orders, manage fulfillment, handle returns, and track
                  shipments.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <Users className="h-8 w-8 text-shopify-purple" />
                <CardTitle className="mt-4 text-xl">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  View customer profiles, manage segments, and track customer
                  lifetime value.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <BarChart className="h-8 w-8 text-shopify-teal" />
                <CardTitle className="mt-4 text-xl">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track sales, traffic, and performance with detailed reports
                  and dashboards.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <Palette className="h-8 w-8 text-shopify-yellow" />
                <CardTitle className="mt-4 text-xl">Online Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage theme, pages, navigation, and content that shapes the
                  storefront experience.
                </p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <Settings className="h-8 w-8 text-gray-700" />
                <CardTitle className="mt-4 text-xl">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Configure store settings, payments, shipping, taxes, and more.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed walkthrough */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Shopify Admin walkthrough
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Below are the most common admin areas you&apos;ll use day-to-day,
            with exactly where to find them and what they do.
          </p>

          <div className="mt-6 not-prose">
            <AdminWalkthroughTabs />
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Navigating the Admin
          </h2>
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Left Sidebar</h3>
            <p className="text-gray-700">
              The main navigation is located in the left sidebar. It provides
              quick access to all major sections of your store. You can collapse
              it for more screen space.
            </p>

            <h3 className="text-xl font-semibold mt-6">Search Bar</h3>
            <p className="text-gray-700">
              Use the search bar (⌘K or Ctrl+K) to quickly find products,
              orders, customers, or navigate to any page in the admin.
            </p>

            <h3 className="text-xl font-semibold mt-6">Notifications</h3>
            <p className="text-gray-700">
              The bell icon shows important notifications about your store,
              including new orders, inventory alerts, and system updates.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Essential Features
          </h2>
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold">Bulk Actions</h3>
              <p className="mt-2 text-gray-700">
                Select multiple items (products, orders, customers) and perform
                actions on all of them at once. Great for efficiency.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold">Filters & Sorting</h3>
              <p className="mt-2 text-gray-700">
                Use advanced filters to find exactly what you&apos;re looking
                for. Save custom filters for frequently used searches.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold">Timeline & Activity</h3>
              <p className="mt-2 text-gray-700">
                Every order and customer page includes a timeline showing all
                activities and changes. Perfect for tracking history.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Pro Tips</h2>
          <div className="mt-6 rounded-lg border border-shopify-blue/20 bg-shopify-blue/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Use keyboard shortcuts to navigate faster (press ? to see all
                shortcuts)
              </li>
              <li>
                Customize your home dashboard to show the metrics that matter
                most
              </li>
              <li>
                Set up staff accounts with specific permissions for team members
              </li>
              <li>Enable two-factor authentication for enhanced security</li>
              <li>Regularly check the Reports section for business insights</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
