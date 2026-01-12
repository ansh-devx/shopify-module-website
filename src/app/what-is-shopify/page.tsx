import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = {
  title: "What is Shopify - Shopify Learn",
  description:
    "A brief overview of Shopify's platform structure for developers.",
};

export default function WhatIsShopify() {
  return (
    <ContentLayout
      title="What is Shopify?"
      description="A brief overview of Shopify's platform structure and key concepts."
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            Shopify is a commerce platform that powers online stores. As
            developers, you&apos;ll primarily work with three areas:
          </p>
        </section>

        {/* Key Areas */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Platform Structure
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Storefront</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The customer-facing website built with Liquid templates,
                  sections, and themes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The backend where merchants manage products, orders, and store
                  settings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  GraphQL and REST APIs for extending functionality through apps
                  and integrations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Development Workflow */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">How We Work</h2>
          <p className="mt-4 text-lg text-gray-700">
            You&apos;ll typically work with:
          </p>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
            <li>
              <strong>Themes:</strong> Custom storefront designs using Liquid,
              HTML, CSS, and JavaScript
            </li>
            <li>
              <strong>Sections & Templates:</strong> Reusable components and
              page layouts
            </li>
            <li>
              <strong>Apps:</strong> Extensions that add functionality to stores
            </li>
            <li>
              <strong>APIs:</strong> For custom integrations and data management
            </li>
          </ul>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Next Steps</h2>
          <p className="mt-4 text-lg text-gray-700">
            Continue with the Partners Dashboard to set up your development
            environment, then explore the Store Admin to understand the platform
            structure.
          </p>
        </section>
      </div>
    </ContentLayout>
  );
}
