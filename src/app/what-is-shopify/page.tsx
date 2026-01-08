import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { TrendingUp, Globe, Users, DollarSign } from "lucide-react";

export const metadata = {
  title: "What is Shopify - Shopify Learn",
  description: "Discover Shopify's platform, its global growth, and why it's the leading e-commerce solution.",
};

export default function WhatIsShopify() {
  return (
    <ContentLayout
      title="What is Shopify?"
      description="Discover Shopify's platform, its global growth, and why it's the leading e-commerce solution."
      nextPage={{ title: "Partners Dashboard", href: "/partners-dashboard" }}
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify is a complete commerce platform that lets you start, grow, and manage a business. 
            It's a cloud-based, multi-channel commerce platform designed for small and medium-sized businesses.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            Founded in 2006, Shopify has grown to power over 4.5 million stores worldwide, processing 
            billions of dollars in sales annually.
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
                  Build a beautiful online store with customizable themes and powerful tools.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Point of Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sell in person with Shopify POS, syncing online and offline sales.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Multi-Channel Selling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sell on social media, marketplaces, and other channels from one platform.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">App Ecosystem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Extend functionality with 8,000+ apps from the Shopify App Store.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Global Growth */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Shopify's Global Growth</h2>
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
              <div className="mt-4 text-3xl font-bold text-gray-900">$500B+</div>
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
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Shopify?</h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <Badge variant="success">1</Badge>
              <div>
                <h3 className="text-xl font-semibold">Easy to Use</h3>
                <p className="mt-2 text-gray-600">
                  No coding required to set up and manage your store. Intuitive interface for beginners.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge variant="success">2</Badge>
              <div>
                <h3 className="text-xl font-semibold">Scalable</h3>
                <p className="mt-2 text-gray-600">
                  Grows with your business from startup to enterprise. Handles high traffic and sales volume.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge variant="success">3</Badge>
              <div>
                <h3 className="text-xl font-semibold">Secure & Reliable</h3>
                <p className="mt-2 text-gray-600">
                  Level 1 PCI DSS compliant, 99.99% uptime, and enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

