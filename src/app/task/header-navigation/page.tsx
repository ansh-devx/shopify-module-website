import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "Header & Navigation - Shopify Learn",
  description:
    "Learn how to build the header and integrate navigation menus for your task.",
};

export default function HeaderNavigationPage() {
  return (
    <ContentLayout
      title="Header & Navigation"
      description="Learn how to build your header according to the Figma design and integrate navigation menus"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            Your PDP task requires building a header that matches the Figma
            design. This includes integrating navigation menus and ensuring it
            works across your entire store.
          </p>
        </section>

        {/* Header Structure */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Header Structure</h2>
          <p className="mt-4 text-lg text-gray-700">
            The header is typically built as a section that appears on all pages
            of your theme. It includes:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Your store&apos;s logo or brand name, usually linking to the
                  homepage
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Navigation Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Links to collections, pages, and other important pages
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Search Icon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Search functionality (optional, if in your design)
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Cart Icon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80">
                  Link to cart page or cart drawer trigger
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Building the Header Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Building Your Header Section
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Headers are typically built as sections in your theme. Here&apos;s
            how to approach it:
          </p>

          <div className="mt-6 space-y-4">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Create Header Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-white/80 list-decimal list-inside">
                  <li>
                    Create a new section file in{" "}
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      sections/
                    </code>
                    , e.g.,{" "}
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      header.liquid
                    </code>
                  </li>
                  <li>
                    Build the HTML structure according to your Figma design
                  </li>
                  <li>
                    Use Liquid variables like{" "}
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      shop.name
                    </code>{" "}
                    for the logo
                  </li>
                  <li>Add schema settings for customization</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Include in Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-3">
                  The header section needs to be included in all your templates
                  (product, collection, index, etc.) so it appears on every
                  page.
                </p>
                <p className="text-sm text-white/60">
                  You can include it at the top of each template, or use a
                  layout file if your theme supports it.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation Menus */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Integrating Navigation Menus
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify menus are created in the admin and accessed in Liquid
            through the{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
              linklists
            </code>{" "}
            object.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Create Menu in Admin
                  </h3>
                  <p className="mt-2 text-white/80">
                    Go to <strong>Online Store → Navigation</strong> and create
                    a new menu (e.g., &quot;Main menu&quot;).
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Add links to collections, pages, or external URLs.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Use in Your Header
                  </h3>
                  <p className="mt-2 text-white/80">
                    In your header section, use Liquid to output the menu:
                  </p>
                  <div className="mt-3 rounded bg-gray-700/50 p-3 text-sm text-white/80 font-mono">
                    {`{% for link in linklists.main-menu.links %}
  <a href="{{ link.url }}">{{ link.title }}</a>
{% endfor %}`}
                  </div>
                  <p className="mt-3 text-sm text-white/60">
                    Replace{" "}
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      main-menu
                    </code>{" "}
                    with your menu&apos;s handle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Styling */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Styling Your Header
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Match your Figma design by styling the header with CSS:
          </p>

          <div className="mt-6 rounded-lg border border-[#24393d] bg-[#151d1e] p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Key Styling Considerations
            </h3>
            <ul className="space-y-2 text-white/80 list-disc list-inside">
              <li>
                <strong>Layout:</strong> Use flexbox or grid to arrange logo and
                menu items
              </li>
              <li>
                <strong>Colors:</strong> Match colors from your Figma design
              </li>
              <li>
                <strong>Typography:</strong> Use appropriate font sizes and
                weights for menu items
              </li>
              <li>
                <strong>Spacing:</strong> Ensure proper padding and margins
                between elements
              </li>
              <li>
                <strong>Mobile:</strong> Consider a mobile menu (hamburger) for
                smaller screens
              </li>
            </ul>
          </div>
        </section>

        {/* For Your task */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">For Your task</h2>
          <div className="mt-6 space-y-4">
            <Card className="border-shopify-green/50 bg-shopify-green/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Checklist
                </h3>
                <ul className="space-y-2 text-white/80 list-disc list-inside">
                  <li>Review your Figma design for header specifications</li>
                  <li>Create a header section in your theme</li>
                  <li>Create a navigation menu in Shopify admin</li>
                  <li>Integrate the menu into your header using Liquid</li>
                  <li>Style the header to match the Figma design</li>
                  <li>
                    Test the header on different pages (homepage, product,
                    collection)
                  </li>
                  <li>Ensure mobile responsiveness</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation on headers and navigation:
          </p>
          <div className="mt-4 space-y-2">
            <div>
              <a
                href="https://shopify.dev/docs/themes/architecture/sections"
                target="_blank"
                rel="noopener noreferrer"
                className="text-shopify-blue hover:underline font-medium"
              >
                Shopify Sections Documentation →
              </a>
            </div>
            <div>
              <a
                href="https://shopify.dev/docs/api/liquid/objects/linklists"
                target="_blank"
                rel="noopener noreferrer"
                className="text-shopify-blue hover:underline font-medium"
              >
                Linklists Object Documentation →
              </a>
            </div>
            <div>
              <Link
                href="/live-coding/sections"
                className="text-shopify-blue hover:underline font-medium"
              >
                Sections & Schema Guide →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
