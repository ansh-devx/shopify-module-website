import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { TrendingUp, Globe, Users, DollarSign } from "lucide-react";

export const metadata = {
  title: "What is Shopify - Shopify Learn",
  description:
    "Discover Shopify's platform, its global growth, and why it's the leading e-commerce solution.",
};

export default function WhatIsShopify() {
  return (
    <ContentLayout
      title="What is Shopify?"
      description="Discover Shopify, its global growth, and why it is a leading commerce platform for both merchants and developers."
      nextPage={{ title: "Partners Dashboard", href: "/partners-dashboard" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify is a complete commerce platform that lets you start, grow,
            and manage a business. It is a cloud-based, multi-channel platform
            used by businesses of all sizes.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            Beyond the storefront, Shopify includes a powerful admin, checkout,
            payments, and a deep set of APIs and extensibility tools. That means
            you can go far beyond a basic theme and build highly custom,
            high-performance experiences.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            Founded in 2006, Shopify has grown to power over 4.5 million stores
            worldwide, processing billions of dollars in sales annually.
          </p>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Online Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build a storefront with themes, Liquid templates, custom
                  sections, and bespoke UI components.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Point of Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sell in person with Shopify POS, syncing online and offline
                  sales.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Multi-Channel Selling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sell on social media, marketplaces, and other channels from
                  one platform.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">App Ecosystem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Extend functionality with 8,000+ apps from the Shopify App
                  Store.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What you can build */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            What you can build with Shopify
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify is not only a platform for launching a store. It is an
            extensible foundation for building custom commerce experiences.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Custom themes and sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create fully custom themes, reusable sections, and rich
                  product pages tailored to a brand.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Landing pages and conversion flows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build campaign landing pages, bundles, upsells, and
                  merchandising experiences focused on conversion rate.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Performance and personalization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Optimize Core Web Vitals, reduce load times, and implement
                  personalized content and recommendations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Apps, Functions, and backend services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build custom Shopify apps, Shopify Functions, and connect
                  external services like AWS-powered backends via APIs and
                  webhooks.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Global Growth */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Shopify Global Growth
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-shopify-green/10 to-shopify-teal/10 p-6">
              <Globe className="h-8 w-8 text-shopify-green" />
              <div className="mt-4 text-3xl font-bold text-gray-900">175+</div>
              <div className="mt-1 text-sm text-gray-600">Countries</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-shopify-blue/10 to-shopify-purple/10 p-6">
              <Users className="h-8 w-8 text-shopify-blue" />
              <div className="mt-4 text-3xl font-bold text-gray-900">4.5M+</div>
              <div className="mt-1 text-sm text-gray-600">Active Stores</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-shopify-purple/10 to-shopify-green/10 p-6">
              <DollarSign className="h-8 w-8 text-shopify-purple" />
              <div className="mt-4 text-3xl font-bold text-gray-900">
                $500B+
              </div>
              <div className="mt-1 text-sm text-gray-600">GMV Processed</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-shopify-teal/10 to-shopify-blue/10 p-6">
              <TrendingUp className="h-8 w-8 text-shopify-teal" />
              <div className="mt-4 text-3xl font-bold text-gray-900">10K+</div>
              <div className="mt-1 text-sm text-gray-600">Employees</div>
            </div>
          </div>
        </section>

        {/* Why Choose Shopify */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Shopify?
          </h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <Badge variant="success">1</Badge>
              <div>
                <h3 className="text-xl font-semibold">
                  Customization without limits
                </h3>
                <p className="mt-2 text-gray-600">
                  Shopify supports everything from polished themes to fully
                  custom builds: custom themes, custom sections, bespoke landing
                  pages, advanced personalization, and animation-heavy brand
                  experiences.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge variant="success">2</Badge>
              <div>
                <h3 className="text-xl font-semibold">
                  Built for performance and conversion
                </h3>
                <p className="mt-2 text-gray-600">
                  With the right implementation, you can improve site speed,
                  user experience, and conversion rate through performance
                  optimization, CRO-focused design, and purpose-built landing
                  pages.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge variant="success">3</Badge>
              <div>
                <h3 className="text-xl font-semibold">
                  Extensible with apps and backend integrations
                </h3>
                <p className="mt-2 text-gray-600">
                  Shopify is designed to integrate: build custom apps, ship
                  Shopify Functions for tailored business logic, and connect
                  AWS-backed services and external systems to create powerful
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            How we help brands on Shopify
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            We revamp Shopify stores with custom code and a focus on measurable
            outcomes.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-shopify-purple/10 to-shopify-blue/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Design and build
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li>Custom themes, sections, and reusable components</li>
                <li>Landing pages for campaigns and product launches</li>
                <li>High-end interactions and animation-driven experiences</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-shopify-green/10 to-shopify-teal/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Engineering and growth
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
                <li>
                  Performance improvements and Core Web Vitals optimization
                </li>
                <li>Conversion-rate improvements through UX and CRO</li>
                <li>
                  Custom apps, Shopify Functions, and AWS-connected backend
                  services
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
