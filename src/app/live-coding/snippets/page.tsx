import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function SnippetsPage() {
  return (
    <ContentLayout
      title="Snippets"
      description="Learn how to create and use reusable Liquid code snippets"
    >
      <div className="space-y-8">
        {/* What are Snippets */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What are Snippets?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Snippets are reusable pieces of Liquid code that you can include in multiple places across your theme. 
            They help you avoid code duplication and make your theme easier to maintain.
          </p>
        </section>

        {/* Creating a Snippet */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Creating a Snippet</h2>
          <p className="mt-4 text-lg text-gray-700">
            Snippets are stored in the <code className="rounded bg-gray-100 px-2 py-1 text-sm">snippets/</code> directory 
            and have a <code className="rounded bg-gray-100 px-2 py-1 text-sm">.liquid</code> extension.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Example: Product Card Snippet</h3>
          <CodeBlock
            code={`<div class="product-card">
  <a href="{{ product.url }}">
    {% if product.featured_image %}
      <img 
        src="{{ product.featured_image | img_url: 'medium' }}" 
        alt="{{ product.featured_image.alt | escape }}"
        loading="lazy"
      >
    {% endif %}
    
    <h3 class="product-title">{{ product.title }}</h3>
    
    <div class="product-price">
      {% if product.compare_at_price > product.price %}
        <span class="price-sale">{{ product.price | money }}</span>
        <span class="price-compare">{{ product.compare_at_price | money }}</span>
      {% else %}
        <span class="price">{{ product.price | money }}</span>
      {% endif %}
    </div>
    
    {% if product.available %}
      <button class="btn-add-to-cart">Add to Cart</button>
    {% else %}
      <button class="btn-sold-out" disabled>Sold Out</button>
    {% endif %}
  </a>
</div>`}
            language="liquid"
            filename="snippets/product-card.liquid"
          />
        </section>

        {/* Using Snippets */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Using Snippets</h2>
          <p className="mt-4 text-lg text-gray-700">
            You can include snippets in your theme using the <code className="rounded bg-gray-100 px-2 py-1 text-sm">render</code> tag.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Basic Usage</h3>
          <CodeBlock
            code={`{% render 'product-card', product: product %}`}
            language="liquid"
            filename="sections/collection.liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Example: Collection Grid</h3>
          <CodeBlock
            code={`<div class="collection-grid">
  {% for product in collection.products %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>`}
            language="liquid"
            filename="sections/collection-grid.liquid"
          />
        </section>

        {/* Passing Variables */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Passing Variables to Snippets</h2>
          <p className="mt-4 text-lg text-gray-700">
            You can pass multiple variables to snippets to make them more flexible.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Example: Button Snippet</h3>
          <CodeBlock
            code={`<a 
  href="{{ url }}" 
  class="btn btn-{{ style }}"
  {% if target_blank %}target="_blank"{% endif %}
>
  {{ text }}
</a>`}
            language="liquid"
            filename="snippets/button.liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">Using the Button Snippet</h3>
          <CodeBlock
            code={`{% render 'button', 
  text: 'Shop Now', 
  url: '/collections/all', 
  style: 'primary' 
%}

{% render 'button', 
  text: 'Learn More', 
  url: '/pages/about', 
  style: 'secondary',
  target_blank: true 
%}`}
            language="liquid"
            filename="sections/hero.liquid"
          />
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Keep snippets focused on a single purpose</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Use descriptive names for your snippets</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Document the variables your snippet expects</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-shopify-green">✓</span>
              <span>Avoid deeply nested snippet includes</span>
            </li>
          </ul>
        </section>
      </div>
    </ContentLayout>
  );
}

