import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "Theme Editor Navigation - Shopify Learn",
  description:
    "Learn how to navigate and use the Shopify theme editor for your task.",
};

export default function ThemeEditorPage() {
  return (
    <ContentLayout
      title="Theme Editor Navigation"
      description="Learn how to navigate the theme editor, add sections, and manage your PDP layout"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            The theme editor is where you&apos;ll customize your PDP layout, add
            sections, and manage blocks. Understanding how to navigate it is
            essential for completing your task.
          </p>
        </section>

        {/* Accessing Theme Editor */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Accessing the Theme Editor
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Navigate to Online Store
                  </h3>
                  <p className="mt-2 text-white/80">
                    In your Shopify admin, go to <strong>Online Store</strong>{" "}
                    in the left sidebar.
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
                    Click Customize
                  </h3>
                  <p className="mt-2 text-white/80">
                    Find your published theme and click{" "}
                    <strong>&quot;Customize&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigating Pages */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Navigating Between Pages
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            The theme editor lets you switch between different page types to
            customize each one.
          </p>

          <div className="mt-6 rounded-lg border border-[#24393d] bg-[#151d1e] p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Page Selector
            </h3>
            <p className="text-white/80 mb-4">
              At the top of the theme editor, you&apos;ll see a dropdown to
              select different page types:
            </p>
            <ul className="space-y-2 text-white/80 list-disc list-inside">
              <li>
                <strong>Homepage:</strong> Customize your store&apos;s homepage
              </li>
              <li>
                <strong>Product pages:</strong> Customize product detail pages
              </li>
              <li>
                <strong>Collection pages:</strong> Customize collection listing
                pages
              </li>
              <li>
                <strong>Cart:</strong> Customize the shopping cart page
              </li>
              <li>
                <strong>Other pages:</strong> Pages, blogs, search, etc.
              </li>
            </ul>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 For Your task</h4>
            <p className="mt-2 text-sm text-blue-800">
              Select <strong>&quot;Product pages&quot;</strong> from the
              dropdown to customize your PDP. You can also select a specific
              product to see how it looks with your template.
            </p>
          </div>
        </section>

        {/* Adding Sections */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Adding Sections</h2>
          <p className="mt-4 text-lg text-gray-700">
            Sections are the building blocks of your PDP. Here&apos;s how to add
            them:
          </p>

          <div className="mt-6 space-y-4">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Add a Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-white/80 list-decimal list-inside">
                  <li>
                    Click <strong>&quot;Add section&quot;</strong> button at the
                    bottom of the sections list
                  </li>
                  <li>
                    Browse available sections or search for a specific one
                  </li>
                  <li>Click on a section to add it to your template</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Reorder Sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Click and drag the <strong>⋮⋮</strong> icon (six dots) next to
                  a section to reorder it. The order in the editor matches the
                  order on the page.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Managing Blocks */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Managing Blocks Within Sections
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Many sections support blocks - repeatable content units. For
            example, a features section might have multiple feature blocks.
          </p>

          <div className="mt-6 space-y-4">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Add a Block
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-white/80 list-decimal list-inside">
                  <li>Click on a section to expand it</li>
                  <li>
                    Click <strong>&quot;Add block&quot;</strong> within that
                    section
                  </li>
                  <li>Select the block type you want to add</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Hide or Delete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/80 list-disc list-inside">
                  <li>
                    <strong>Hide:</strong> Click the eye icon to hide a section
                    or block without deleting it
                  </li>
                  <li>
                    <strong>Delete:</strong> Click the trash icon to permanently
                    remove a section or block
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Section and Block Settings
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Each section and block has settings you can customize:
          </p>

          <div className="mt-6 rounded-lg border border-[#24393d] bg-[#151d1e] p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Common Settings
            </h3>
            <ul className="space-y-2 text-white/80 list-disc list-inside">
              <li>
                <strong>Content:</strong> Text, images, links, and other content
                settings
              </li>
              <li>
                <strong>Layout:</strong> Column count, spacing, alignment
              </li>
              <li>
                <strong>Colors:</strong> Background colors, text colors, accent
                colors
              </li>
              <li>
                <strong>Typography:</strong> Font sizes, weights, styles
              </li>
            </ul>
          </div>
        </section>

        {/* Navigation Tips */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Navigation Tips for Your task
          </h2>
          <div className="mt-6 space-y-4">
            <Card className="border-shopify-green/50 bg-shopify-green/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  From Homepage to Product Page
                </h3>
                <ol className="space-y-2 text-white/80 list-decimal list-inside">
                  <li>
                    Select <strong>&quot;Homepage&quot;</strong> in the page
                    selector
                  </li>
                  <li>Find a product card section or add one</li>
                  <li>
                    Click on a product link - this will switch the editor to
                    that product&apos;s page
                  </li>
                  <li>
                    Alternatively, select{" "}
                    <strong>&quot;Product pages&quot;</strong> and choose a
                    specific product
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-shopify-green/50 bg-shopify-green/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Testing Your Changes
                </h3>
                <ul className="space-y-2 text-white/80 list-disc list-inside">
                  <li>Changes are saved automatically as you make them</li>
                  <li>Use the preview panel to see changes in real-time</li>
                  <li>
                    Click <strong>&quot;View&quot;</strong> to open your store
                    in a new tab
                  </li>
                  <li>
                    Test on different devices using the device selector
                    (desktop, tablet, mobile)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation on the theme editor:
          </p>
          <div className="mt-4">
            <a
              href="https://shopify.dev/docs/themes/tools/theme-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shopify-blue hover:underline font-medium"
            >
              Shopify Theme Editor Documentation →
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
