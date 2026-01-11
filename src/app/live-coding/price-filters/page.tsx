import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function PriceFiltersPage() {
  return (
    <ContentLayout
      title="Price Filters"
      description="Learn how to use Liquid filters to format and manipulate prices"
    >
      <div className="space-y-8">
        {/* Money Filter */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Money Filter</h2>
          <p className="mt-4 text-lg text-gray-700">
            The{" "}
            <code className="rounded bg-gray-100 px-2 py-1 text-sm">money</code>{" "}
            filter formats a price in cents to a currency format.
          </p>

          <CodeBlock
            code={`<!-- Basic money filter -->
{{ product.price | money }}
<!-- Output: $29.99 -->

{{ 2999 | money }}
<!-- Output: $29.99 -->

{{ variant.price | money }}
<!-- Output: $49.99 -->`}
            language="liquid"
            filename="money-filter.liquid"
          />
        </section>

        {/* Money Without Currency */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Money Without Currency
          </h2>
          <CodeBlock
            code={`<!-- Remove currency symbol -->
{{ product.price | money_without_currency }}
<!-- Output: 29.99 -->

<!-- Useful for calculations or custom formatting -->
<span class="currency-symbol">$</span>
<span class="price-amount">{{ product.price | money_without_currency }}</span>`}
            language="liquid"
            filename="money-without-currency.liquid"
          />
        </section>

        {/* Money With Currency */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Money With Currency
          </h2>
          <CodeBlock
            code={`<!-- Include currency code -->
{{ product.price | money_with_currency }}
<!-- Output: $29.99 USD -->

{{ variant.price | money_with_currency }}
<!-- Output: $49.99 USD -->`}
            language="liquid"
            filename="money-with-currency.liquid"
          />
        </section>

        {/* Price Comparisons */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Price Comparisons
          </h2>
          <CodeBlock
            code={`<!-- Show sale price -->
{% if product.compare_at_price > product.price %}
  <div class="price-container">
    <span class="price-original">
      {{ product.compare_at_price | money }}
    </span>
    <span class="price-sale">
      {{ product.price | money }}
    </span>
    <span class="price-savings">
      Save {{ product.compare_at_price | minus: product.price | money }}
    </span>
  </div>
{% else %}
  <span class="price">{{ product.price | money }}</span>
{% endif %}`}
            language="liquid"
            filename="price-comparison.liquid"
          />
        </section>

        {/* Price Range */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Price Range</h2>
          <CodeBlock
            code={`<!-- Show price range for products with variants -->
{% if product.price_varies %}
  <span class="price-range">
    {{ product.price_min | money }} - {{ product.price_max | money }}
  </span>
{% else %}
  <span class="price">{{ product.price | money }}</span>
{% endif %}

<!-- Alternative format -->
{% if product.price_varies %}
  From {{ product.price_min | money }}
{% else %}
  {{ product.price | money }}
{% endif %}`}
            language="liquid"
            filename="price-range.liquid"
          />
        </section>

        {/* Discount Percentage */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Calculate Discount Percentage
          </h2>
          <CodeBlock
            code={`{% if product.compare_at_price > product.price %}
  {% assign discount = product.compare_at_price | minus: product.price %}
  {% assign discount_percentage = discount | times: 100.0 | divided_by: product.compare_at_price | round %}
  
  <span class="discount-badge">
    -{{ discount_percentage }}%
  </span>
{% endif %}`}
            language="liquid"
            filename="discount-percentage.liquid"
          />
        </section>

        {/* Unit Price */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Unit Price</h2>
          <CodeBlock
            code={`<!-- Display unit price if available -->
{% if variant.unit_price_measurement %}
  <div class="unit-price">
    {{ variant.unit_price | money }}/
    {% if variant.unit_price_measurement.reference_value != 1 %}
      {{ variant.unit_price_measurement.reference_value }}
    {% endif %}
    {{ variant.unit_price_measurement.reference_unit }}
  </div>
{% endif %}

<!-- Example output: $2.99/100g -->`}
            language="liquid"
            filename="unit-price.liquid"
          />
        </section>

        {/* Custom Price Formatting */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Custom Price Formatting
          </h2>
          <CodeBlock
            code={`<!-- Split dollars and cents -->
{% assign price_parts = product.price | money_without_currency | split: '.' %}
<span class="price-dollars">{{ price_parts[0] }}</span>
<span class="price-cents">.{{ price_parts[1] }}</span>

<!-- Add custom styling -->
<div class="custom-price">
  <span class="currency">$</span>
  <span class="amount">{{ product.price | money_without_currency }}</span>
  <span class="currency-code">USD</span>
</div>`}
            language="liquid"
            filename="custom-price-format.liquid"
          />
        </section>

        {/* Reference */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Quick Reference</h2>
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm text-gray-700">
              You can explore more price filters and Liquid syntax in the{" "}
              <a
                href="/liquid-cheatsheet"
                className="text-shopify-green hover:underline"
              >
                Liquid Cheatsheet
              </a>
            </p>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
