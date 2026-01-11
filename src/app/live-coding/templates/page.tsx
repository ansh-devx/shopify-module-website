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
          <h2 className="text-3xl font-bold text-gray-900">
            What are Templates?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Templates are JSON files that define the structure and layout for
            different types of pages in your Shopify store. They determine which
            sections appear on each page type.
          </p>
        </section>

        {/* Template Structure */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Template Structure
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Templates are stored in the{" "}
            <code className="rounded bg-gray-100 px-2 py-1 text-sm">
              templates/
            </code>{" "}
            directory and use JSON format to define sections and their order.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">
            Example: Product Template
          </h3>
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
          <h2 className="text-3xl font-bold text-gray-900">
            Common Template Types
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">index.json</h4>
              <p className="mt-2 text-sm text-gray-700">Homepage template</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">product.json</h4>
              <p className="mt-2 text-sm text-gray-700">
                Product page template
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">collection.json</h4>
              <p className="mt-2 text-sm text-gray-700">
                Collection page template
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">page.json</h4>
              <p className="mt-2 text-sm text-gray-700">
                Standard page template
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">cart.json</h4>
              <p className="mt-2 text-sm text-gray-700">
                Shopping cart template
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">404.json</h4>
              <p className="mt-2 text-sm text-gray-700">Error page template</p>
            </div>
          </div>
        </section>

        {/* Example: Collection Template */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Example: Collection Template
          </h2>
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

        {/* Alternative Templates */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Alternative Templates
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            You can create alternative templates for the same page type by
            adding a suffix to the filename.
          </p>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Example</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>
                •{" "}
                <code className="rounded bg-blue-100 px-2 py-1">
                  product.json
                </code>{" "}
                - Default product template
              </li>
              <li>
                •{" "}
                <code className="rounded bg-blue-100 px-2 py-1">
                  product.featured.json
                </code>{" "}
                - Featured product template
              </li>
              <li>
                •{" "}
                <code className="rounded bg-blue-100 px-2 py-1">
                  product.minimal.json
                </code>{" "}
                - Minimal product template
              </li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
