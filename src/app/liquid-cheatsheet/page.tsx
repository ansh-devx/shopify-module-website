import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Liquid Cheatsheet - Shopify Learn",
  description: "Master Shopify's templating language with our comprehensive Liquid reference.",
};

export default function LiquidCheatsheet() {
  return (
    <ContentLayout
      title="Liquid Cheatsheet"
      description="Your comprehensive reference for Shopify's Liquid templating language."
      previousPage={{ title: "GitHub Config", href: "/github-config" }}
      nextPage={{ title: "Cart APIs", href: "/cart-apis" }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">What is Liquid?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Liquid is an open-source templating language created by Shopify. It's the backbone of Shopify 
            themes and is used to load dynamic content on storefronts.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Basic Syntax</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <Badge variant="info">Output</Badge>
                <CardTitle className="mt-4 text-xl">{{ "{{ }}" }}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Outputs content to the page</p>
                <CodeBlock
                  code={`{{ product.title }}
{{ 'Hello World' }}
{{ product.price | money }}`}
                  language="liquid"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="warning">Logic</Badge>
                <CardTitle className="mt-4 text-xl">{% "{%" %}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Executes logic and control flow</p>
                <CodeBlock
                  code={`{% if product.available %}
  In Stock
{% endif %}

{% for item in cart.items %}
  {{ item.title }}
{% endfor %}`}
                  language="liquid"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Variables</h2>
          <CodeBlock
            code={`{% assign my_variable = 'Hello' %}
{{ my_variable }}

{% capture my_capture %}
  This is captured content
{% endcapture %}
{{ my_capture }}`}
            language="liquid"
            filename="variables.liquid"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Conditional Logic</h2>
          <CodeBlock
            code={`{% if product.available %}
  <button>Add to Cart</button>
{% elsif product.tags contains 'coming-soon' %}
  <p>Coming Soon</p>
{% else %}
  <p>Sold Out</p>
{% endif %}

{% unless product.available %}
  <p>Not available</p>
{% endunless %}

{% case product.type %}
  {% when 'Shirt' %}
    This is a shirt
  {% when 'Pants' %}
    This is pants
  {% else %}
    This is something else
{% endcase %}`}
            language="liquid"
            filename="conditionals.liquid"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Loops</h2>
          <CodeBlock
            code={`{% for product in collection.products %}
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
{% endfor %}

{% for i in (1..5) %}
  Item {{ i }}
{% endfor %}

{% for product in collection.products limit:4 %}
  {{ product.title }}
{% endfor %}

{% for product in collection.products offset:2 %}
  {{ product.title }}
{% endfor %}`}
            language="liquid"
            filename="loops.liquid"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Common Filters</h2>
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">String Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`{{ 'hello world' | capitalize }}  → Hello world
{{ 'Hello World' | downcase }}     → hello world
{{ 'Hello World' | upcase }}       → HELLO WORLD
{{ 'Hello' | append: ' World' }}   → Hello World
{{ 'Hello World' | remove: 'World' }} → Hello
{{ 'Hello World' | replace: 'World', 'There' }} → Hello There
{{ 'Hello World' | split: ' ' }}   → ['Hello', 'World']
{{ 'Hello World' | truncate: 8 }}  → Hello...`}
                  language="liquid"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Number Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`{{ 1999 | money }}                 → $19.99
{{ 1999 | money_with_currency }}  → $19.99 USD
{{ 4.5612 | round: 2 }}           → 4.56
{{ 16 | divided_by: 4 }}          → 4
{{ 5 | times: 2 }}                → 10
{{ 10 | minus: 5 }}               → 5
{{ 10 | plus: 5 }}                → 15`}
                  language="liquid"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Array Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`{{ collection.products | size }}
{{ collection.products | first }}
{{ collection.products | last }}
{{ collection.products | join: ', ' }}
{{ collection.products | map: 'title' }}
{{ collection.products | where: 'available' }}
{{ collection.products | sort: 'price' }}
{{ collection.products | reverse }}`}
                  language="liquid"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">URL & Asset Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`{{ 'style.css' | asset_url }}
{{ 'logo.png' | asset_url | img_tag }}
{{ product.url | within: collection }}
{{ product.featured_image | img_url: '300x300' }}
{{ 'image.jpg' | img_url: '500x', crop: 'center' }}`}
                  language="liquid"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}

