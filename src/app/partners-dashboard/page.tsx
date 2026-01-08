import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import CodeBlock from "@/components/code-block/CodeBlock";
import { UserPlus, Store, Settings, BarChart } from "lucide-react";

export const metadata = {
  title: "Partners Dashboard - Shopify Learn",
  description: "Learn how to navigate the Shopify Partners Dashboard and accept store organization invitations.",
};

export default function PartnersDashboard() {
  return (
    <ContentLayout
      title="Partners Dashboard"
      description="Learn how to navigate the Shopify Partners Dashboard and manage your development stores."
      previousPage={{ title: "What is Shopify", href: "/what-is-shopify" }}
      nextPage={{ title: "Store Admin", href: "/store-admin" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What is the Partners Dashboard?</h2>
          <p className="mt-4 text-lg text-gray-700">
            The Shopify Partners Dashboard is your central hub for building apps, themes, and managing 
            client stores. It's free to join and provides access to development tools, resources, and 
            revenue opportunities.
          </p>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Getting Started</h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Sign Up</h3>
                <p className="mt-2 text-gray-600">
                  Visit <a href="https://partners.shopify.com" className="text-shopify-blue hover:underline" target="_blank" rel="noopener noreferrer">partners.shopify.com</a> and create your free account.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Complete Your Profile</h3>
                <p className="mt-2 text-gray-600">
                  Add your business information, payment details, and areas of expertise.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Create Development Stores</h3>
                <p className="mt-2 text-gray-600">
                  Set up unlimited free development stores for testing and client work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Features</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Store className="h-8 w-8 text-shopify-green" />
                <CardTitle className="mt-4 text-xl">Development Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create and manage unlimited development stores for testing apps, themes, and client projects.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BarChart className="h-8 w-8 text-shopify-blue" />
                <CardTitle className="mt-4 text-xl">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track app installs, revenue, and performance metrics in real-time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-shopify-purple" />
                <CardTitle className="mt-4 text-xl">App Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build, test, and publish apps to the Shopify App Store.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <UserPlus className="h-8 w-8 text-shopify-teal" />
                <CardTitle className="mt-4 text-xl">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Invite team members and manage permissions for your partner account.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accepting Invitations */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Accepting Store Invitations</h2>
          <p className="mt-4 text-lg text-gray-700">
            When a merchant invites you to collaborate on their store, you'll receive an email invitation.
          </p>
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Steps to Accept:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Check your email for the invitation from Shopify</li>
              <li>Click the "Accept Invitation" button in the email</li>
              <li>Log in to your Partners account (or create one if needed)</li>
              <li>The store will appear in your Partners Dashboard under "Stores"</li>
              <li>Click on the store to access the admin panel</li>
            </ol>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <div className="mt-6 space-y-4 rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Keep your development stores organized with clear naming conventions</li>
              <li>Regularly update your partner profile and payment information</li>
              <li>Use development stores for testing before deploying to production</li>
              <li>Monitor your analytics to understand app performance</li>
              <li>Stay updated with Shopify's partner resources and documentation</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

