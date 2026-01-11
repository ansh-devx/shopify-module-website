import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function MetafieldsPage() {
  return (
    <ContentLayout
      title="Metafields"
      description="Learn how to create and use metafields to store custom data in Shopify"
    >
      <div className="space-y-8">
        {/* What are Metafields */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What are Metafields?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Metafields are custom data fields that let you store additional information beyond Shopify's 
            default fields. They can be attached to products, variants, collections, customers, orders, and more.
          </p>
        </section>

        {/* How to Create Metafields */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">How to Create Metafields</h2>
          
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Step 1: Go to Settings</h3>
              <p className="mt-2 text-gray-700">
                Shopify Admin → Settings → Custom Data
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Step 2: Choose Resource Type</h3>
              <p className="mt-2 text-gray-700">
                Example: Product
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Step 3: Add Definition</h3>
              <p className="mt-2 text-gray-700">Click "Add definition"</p>
            </div>
          </div>
        </section>

        {/* Example: Material Metafield */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Example: Creating "Material" Metafield</h2>
          
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Settings</h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li><strong>Name:</strong> Material</li>
              <li><strong>Namespace:</strong> custom</li>
              <li><strong>Key:</strong> material</li>
              <li><strong>Type:</strong> Single line text</li>
            </ul>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Result</h4>
            <p className="mt-2 text-sm text-blue-800">
              This creates a metafield accessible as: <code className="rounded bg-blue-100 px-2 py-1">custom.material</code>
            </p>
          </div>
        </section>

        {/* Using Metafields in Liquid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Using Metafields in Liquid</h2>
          <CodeBlock
            code={`<!-- Access product metafield -->
{{ product.metafields.custom.material }}

<!-- Check if metafield exists -->
{% if product.metafields.custom.material %}
  <div class="product-material">
    <strong>Material:</strong> {{ product.metafields.custom.material }}
  </div>
{% endif %}

<!-- Multiple metafields -->
<div class="product-details">
  {% if product.metafields.custom.material %}
    <p><strong>Material:</strong> {{ product.metafields.custom.material }}</p>
  {% endif %}
  
  {% if product.metafields.custom.care_instructions %}
    <p><strong>Care:</strong> {{ product.metafields.custom.care_instructions }}</p>
  {% endif %}
  
  {% if product.metafields.custom.country_of_origin %}
    <p><strong>Made in:</strong> {{ product.metafields.custom.country_of_origin }}</p>
  {% endif %}
</div>`}
            language="liquid"
            filename="product-metafields.liquid"
          />
        </section>

        {/* Common Metafield Types */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Common Metafield Types</h2>
          
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">Single line text</h4>
              <p className="mt-2 text-sm text-gray-700">Short text values like material, SKU, or brand</p>
              <CodeBlock
                code={`{{ product.metafields.custom.brand }}`}
                language="liquid"
              />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">Multi-line text</h4>
              <p className="mt-2 text-sm text-gray-700">Longer text like care instructions or descriptions</p>
              <CodeBlock
                code={`{{ product.metafields.custom.care_instructions | newline_to_br }}`}
                language="liquid"
              />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">Number (Integer/Decimal)</h4>
              <p className="mt-2 text-sm text-gray-700">Numeric values like dimensions or ratings</p>
              <CodeBlock
                code={`{{ product.metafields.custom.rating }}/5 stars`}
                language="liquid"
              />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">True/False</h4>
              <p className="mt-2 text-sm text-gray-700">Boolean values for flags or toggles</p>
              <CodeBlock
                code={`{% if product.metafields.custom.is_featured %}
  <span class="badge">Featured</span>
{% endif %}`}
                language="liquid"
              />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">File reference</h4>
              <p className="mt-2 text-sm text-gray-700">Images, PDFs, or other files</p>
              <CodeBlock
                code={`{% if product.metafields.custom.size_guide %}
  <a href="{{ product.metafields.custom.size_guide }}">
    View Size Guide
  </a>
{% endif %}`}
                language="liquid"
              />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">URL</h4>
              <p className="mt-2 text-sm text-gray-700">Web links</p>
              <CodeBlock
                code={`<a href="{{ product.metafields.custom.video_url }}">
  Watch Video
</a>`}
                language="liquid"
              />
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

