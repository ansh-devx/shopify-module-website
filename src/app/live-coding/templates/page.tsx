import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function TemplatesPage() {
  return (
    <ContentLayout
      title="Templates"
      description="Learn how to create and customize JSON templates for different page types"
    >
      <div className="space-y-8">
        {/* What are Templates */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What are Templates?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Templates are JSON files that define the structure and layout for different types of pages in your 
            Shopify store. They determine which sections appear on each page type.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            <strong>For your task:</strong> You&apos;ll need to create a product template for your PDP that matches the Figma design.
          </p>
        </section>

        {/* Template Format */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Template Formats</h2>
          <p className="mt-4 text-lg text-gray-700">
            Templates follow specific naming conventions:
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-[#24393d] bg-[#151d1e] p-4">
              <h4 className="font-semibold text-white mb-2">product.json</h4>
              <p className="text-white/80 text-sm">
                Default product template. Used for all products unless a custom template is assigned.
              </p>
            </div>

            <div className="rounded-lg border border-[#24393d] bg-[#151d1e] p-4">
              <h4 className="font-semibold text-white mb-2">product.[template-name].json</h4>
              <p className="text-white/80 text-sm">
                Custom product templates. Example: <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">product.detailed.json</code>, <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">product.minimal.json</code>
              </p>
            </div>

            <div className="rounded-lg border border-[#24393d] bg-[#151d1e] p-4">
              <h4 className="font-semibold text-white mb-2">collection.json</h4>
              <p className="text-white/80 text-sm">
                Default collection template for all collection pages.
              </p>
            </div>

            <div className="rounded-lg border border-[#24393d] bg-[#151d1e] p-4">
              <h4 className="font-semibold text-white mb-2">collection.[template-name].json</h4>
              <p className="text-white/80 text-sm">
                Custom collection templates. Example: <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">collection.grid.json</code>
              </p>
            </div>

            <div className="rounded-lg border border-[#24393d] bg-[#151d1e] p-4">
              <h4 className="font-semibold text-white mb-2">index.json</h4>
              <p className="text-white/80 text-sm">
                Homepage template. This is what customers see when they visit your store&apos;s homepage.
              </p>
            </div>
          </div>
        </section>

        {/* Template Structure */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Template Structure</h2>
          <p className="mt-4 text-lg text-gray-700">
            Templates are stored in the <code className="rounded bg-gray-100 px-2 py-1 text-sm">templates/</code> directory 
            and use JSON format to define sections and their order.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Example: Product Template</h3>
          <CodeBlock
            code={`{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {
        "enable_sticky_info": true,
        "media_size": "large",
        "gallery_layout": "thumbnail_slider",
        "media_position": "left",
        "image_zoom": "hover",
        "mobile_thumbnails": "show",
        "hide_variants": false,
        "enable_video_looping": false
      }
    },
    "related-products": {
      "type": "related-products",
      "settings": {
        "heading": "You may also like",
        "products_to_show": 4,
        "columns_desktop": 4,
        "color_scheme": "background-1"
      }
    },
    "product-recommendations": {
      "type": "product-recommendations",
      "settings": {
        "heading": "Recommended products",
        "products_to_show": 4
      }
    }
  },
  "order": [
    "main",
    "related-products",
    "product-recommendations"
  ]
}`}
            language="json"
            filename="templates/product.json"
          />
        </section>

        {/* Common Template Types */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Common Template Types</h2>
          
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">index.json</h4>
              <p className="mt-2 text-sm text-gray-700">Homepage template</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">product.json</h4>
              <p className="mt-2 text-sm text-gray-700">Product page template</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">collection.json</h4>
              <p className="mt-2 text-sm text-gray-700">Collection page template</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">page.json</h4>
              <p className="mt-2 text-sm text-gray-700">Standard page template</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">cart.json</h4>
              <p className="mt-2 text-sm text-gray-700">Shopping cart template</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">404.json</h4>
              <p className="mt-2 text-sm text-gray-700">Error page template</p>
            </div>
          </div>
        </section>

        {/* Example: Collection Template */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Example: Collection Template</h2>
          <CodeBlock
            code={`{
  "sections": {
    "banner": {
      "type": "collection-banner",
      "settings": {
        "show_collection_description": true,
        "show_collection_image": true
      }
    },
    "product-grid": {
      "type": "main-collection-product-grid",
      "settings": {
        "products_per_page": 24,
        "columns_desktop": 4,
        "image_ratio": "adapt",
        "show_secondary_image": true,
        "show_vendor": false,
        "show_rating": true,
        "enable_filtering": true,
        "enable_sorting": true,
        "columns_mobile": "2"
      }
    }
  },
  "order": [
    "banner",
    "product-grid"
  ]
}`}
            language="json"
            filename="templates/collection.json"
          />
        </section>

        {/* Assigning Templates */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Assigning Templates to Products</h2>
          <p className="mt-4 text-lg text-gray-700">
            After creating a template, you need to assign it to products or collections in the Shopify admin.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Publish Your Theme</h3>
                  <p className="mt-2 text-white/80">
                    <strong>Important:</strong> Your theme must be published before templates are available in the admin.
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Go to <strong>Online Store → Themes</strong> and click <strong>&quot;Publish&quot;</strong> on your development theme.
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
                  <h3 className="text-lg font-semibold text-white">Assign to a Product</h3>
                  <p className="mt-2 text-white/80">
                    Go to <strong>Products → [Your Product]</strong> and scroll to the <strong>&quot;Theme templates&quot;</strong> section.
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Select your custom template from the dropdown (e.g., <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">product.detailed</code>).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Assign to a Collection</h3>
                  <p className="mt-2 text-white/80">
                    Go to <strong>Products → Collections → [Your Collection]</strong> and scroll to <strong>&quot;Theme templates&quot;</strong>.
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Select your custom collection template from the dropdown.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 For Your task</h4>
            <p className="mt-2 text-sm text-blue-800">
              Create a custom product template (e.g., <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">product.pdp.json</code>) 
              that includes the sections you need for your PDP design. Make sure to publish your theme before assigning the template.
            </p>
          </div>
        </section>

        {/* Alternative Templates */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Alternative Templates</h2>
          <p className="mt-4 text-lg text-gray-700">
            You can create alternative templates for the same page type by adding a suffix to the filename.
          </p>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Examples</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• <code className="rounded bg-blue-100 px-2 py-1">product.json</code> - Default product template</li>
              <li>• <code className="rounded bg-blue-100 px-2 py-1">product.featured.json</code> - Featured product template</li>
              <li>• <code className="rounded bg-blue-100 px-2 py-1">product.minimal.json</code> - Minimal product template</li>
            </ul>
          </div>
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation on templates, visit:
          </p>
          <div className="mt-4">
            <a
              href="https://shopify.dev/docs/themes/architecture/templates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shopify-blue hover:underline font-medium"
            >
              Shopify Templates Documentation →
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

