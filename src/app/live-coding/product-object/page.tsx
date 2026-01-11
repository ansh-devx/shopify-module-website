import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function ProductObjectPage() {
  return (
    <ContentLayout
      title="Product Object"
      description="Learn about the Shopify product object and its properties"
    >
      <div className="space-y-8">
        {/* Basic Product Properties */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Basic Product Properties
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            The product object contains all the information about a product in
            your store.
          </p>

          <CodeBlock
            code={`<!-- Product Title -->
{{ product.title }}

<!-- Product Description -->
{{ product.description }}

<!-- Product Type -->
{{ product.type }}

<!-- Product Vendor -->
{{ product.vendor }}

<!-- Product Handle -->
{{ product.handle }}

<!-- Product URL -->
{{ product.url }}

<!-- Product ID -->
{{ product.id }}`}
            language="liquid"
            filename="product-properties.liquid"
          />
        </section>

        {/* Product Pricing */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Product Pricing</h2>
          <CodeBlock
            code={`<!-- Product Price -->
{{ product.price | money }}

<!-- Compare at Price -->
{{ product.compare_at_price | money }}

<!-- Price Range -->
{{ product.price_min | money }} - {{ product.price_max | money }}

<!-- Check if on sale -->
{% if product.compare_at_price > product.price %}
  <span class="sale-badge">On Sale!</span>
  <span class="original-price">{{ product.compare_at_price | money }}</span>
  <span class="sale-price">{{ product.price | money }}</span>
{% endif %}`}
            language="liquid"
            filename="product-pricing.liquid"
          />
        </section>

        {/* Product Variants */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Product Variants</h2>
          <p className="mt-4 text-lg text-gray-700">
            Variants represent different versions of a product (e.g., different
            sizes or colors).
          </p>

          <CodeBlock
            code={`<!-- Loop through variants -->
{% for variant in product.variants %}
  <div class="variant">
    <p>{{ variant.title }}</p>
    <p>{{ variant.price | money }}</p>
    <p>Available: {{ variant.available }}</p>
  </div>
{% endfor %}

<!-- Selected variant -->
{{ product.selected_or_first_available_variant.title }}
{{ product.selected_or_first_available_variant.price | money }}`}
            language="liquid"
            filename="product-variants.liquid"
          />
        </section>

        {/* Individual Variant Properties */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Individual Variant Properties
          </h2>
          <CodeBlock
            code={`{% assign variant = product.selected_or_first_available_variant %}

<!-- Variant ID -->
{{ variant.id }}

<!-- Variant SKU -->
{{ variant.sku }}

<!-- Variant Barcode -->
{{ variant.barcode }}

<!-- Variant Weight -->
{{ variant.weight | weight_with_unit }}

<!-- Variant Options -->
{{ variant.option1 }}  <!-- e.g., "Small" -->
{{ variant.option2 }}  <!-- e.g., "Red" -->
{{ variant.option3 }}  <!-- e.g., "Cotton" -->

<!-- Variant Inventory -->
{{ variant.inventory_quantity }}
{{ variant.inventory_management }}
{{ variant.inventory_policy }}`}
            language="liquid"
            filename="variant-properties.liquid"
          />
        </section>

        {/* Product Images */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Product Images</h2>
          <CodeBlock
            code={`<!-- Featured Image -->
{% if product.featured_image %}
  <img src="{{ product.featured_image | img_url: 'large' }}" 
       alt="{{ product.featured_image.alt }}">
{% endif %}

<!-- All Product Images -->
{% for image in product.images %}
  <img src="{{ image | img_url: 'medium' }}" 
       alt="{{ image.alt }}">
{% endfor %}

<!-- Variant Image -->
{% if variant.image %}
  <img src="{{ variant.image | img_url: 'large' }}" 
       alt="{{ variant.image.alt }}">
{% endif %}`}
            language="liquid"
            filename="product-images.liquid"
          />
        </section>

        {/* Product Availability */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Product Availability
          </h2>
          <CodeBlock
            code={`<!-- Check if product is available -->
{% if product.available %}
  <button type="submit">Add to Cart</button>
{% else %}
  <button disabled>Sold Out</button>
{% endif %}

<!-- Check variant availability -->
{% for variant in product.variants %}
  {% if variant.available %}
    <option value="{{ variant.id }}">
      {{ variant.title }} - {{ variant.price | money }}
    </option>
  {% else %}
    <option disabled>
      {{ variant.title }} - Sold Out
    </option>
  {% endif %}
{% endfor %}`}
            language="liquid"
            filename="product-availability.liquid"
          />
        </section>

        {/* Product Metafields */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Product Metafields
          </h2>
          <CodeBlock
            code={`<!-- Access product metafields -->
{{ product.metafields.custom.material }}
{{ product.metafields.custom.care_instructions }}
{{ product.metafields.custom.size_guide }}`}
            language="liquid"
            filename="product-metafields.liquid"
          />
        </section>
      </div>
    </ContentLayout>
  );
}
