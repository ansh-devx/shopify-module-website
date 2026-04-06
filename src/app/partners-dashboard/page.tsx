import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Store, Users, Settings } from "lucide-react";

export const metadata = {
  title: "Partners Dashboard - Shopify Learn",
  description:
    "Learn how to navigate the Shopify Partners Dashboard and accept store invitations.",
};

export default function PartnersDashboard() {
  return (
    <ContentLayout
      title="Partners Dashboard"
      description="Your central hub for accessing development stores and managing Shopify projects."
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            The Partners Dashboard is where you&apos;ll access development
            stores, view projects, and manage your Shopify work. You&apos;ll
            need a Partner account to work with Shopify.
          </p>
        </section>

        {/* Access */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Getting Access</h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Sign Up</h3>
                <p className="mt-2 text-text-secondary">
                  Visit{" "}
                  <a
                    href="https://partners.shopify.com"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    partners.shopify.com
                  </a>{" "}
                  and create your free account.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  Join Your Organization
                </h3>
                <p className="mt-2 text-text-secondary">
                  Ask your team lead to invite you to the partner organization.
                  You&apos;ll receive an email invitation to join.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Access Stores</h3>
                <p className="mt-2 text-text-secondary">
                  Once added, you&apos;ll see development stores in your
                  dashboard. Only the partner owner can create new development
                  stores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            What You&apos;ll Find Here
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <Store className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-xl">
                  Development Stores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Access development stores for testing themes, apps, and client
                  work. Each store is visible to the creator and team members
                  with access.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-400" />
                <CardTitle className="mt-4 text-xl">Store Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Access stores you&apos;ve been added to. Store creators can
                  add team members as staff or collaborators.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-accent" />
                <CardTitle className="mt-4 text-xl">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  View and manage apps, themes, and other projects linked to
                  your partner account.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accepting Invitations */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Accepting Store Invitations
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            When you&apos;re invited to collaborate on a store, you&apos;ll
            receive an email invitation:
          </p>
          <ol className="mt-4 space-y-2 text-gray-700 list-decimal list-inside">
            <li>Check your email for the invitation from Shopify</li>
            <li>Click the &quot;Accept Invitation&quot; button</li>
            <li>
              The store will appear in your Partners Dashboard under Stores
            </li>
            <li>Click on the store to access the admin panel</li>
          </ol>
        </section>
      </div>
    </ContentLayout>
  );
}
