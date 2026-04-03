import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = {
  title: "Liquid - Shopify Learn",
  description: "Learn the basics of Liquid, Shopify's templating language.",
};

export default function LiquidCheatsheet() {
  return (
    <ContentLayout
      title="Liquid"
      description="Learn the basics of Liquid, Shopify's templating language for building themes."
    >
      <div className="space-y-8">
        {/* What is Liquid */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">What is Liquid?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Liquid is an open-source templating language created by Shopify.
            It&apos;s the backbone of Shopify themes and is used to load dynamic
            content on storefronts.
          </p>
        </section>

        {/* Basic Syntax */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Basic Syntax</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Output: {"{{ }}"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Outputs content to the page
                </p>
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
                <CardTitle className="text-xl">Logic: {"{% %}"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Executes logic and control flow
                </p>
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

        {/* Variables */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Variables</h2>
          <p className="mt-4 text-lg text-gray-700">
            Variables store values that you can reuse throughout your template.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            assign
          </h3>
          <p className="mt-2 text-gray-700">
            Creates a variable and assigns a value to it.
          </p>
          <CodeBlock
            code={`{% assign my_variable = 'Hello' %}
{{ my_variable }}

{% assign price = 1999 %}
{{ price | money }}`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">capture</h3>
          <p className="mt-2 text-gray-700">
            Captures the text between the tags and assigns it to a variable.
          </p>
          <CodeBlock
            code={`{% capture my_capture %}
  <h2>{{ product.title }}</h2>
  <p>{{ product.description }}</p>
{% endcapture %}

{{ my_capture }}`}
            language="liquid"
          />
        </section>

        {/* Conditional Logic */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Conditional Logic
          </h2>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            {"{% if %}"} / {"{% elsif %}"} / {"{% else %}"}
          </h3>
          <p className="mt-2 text-gray-700">
            Executes a block of code only if a condition is met.
          </p>
          <CodeBlock
            code={`{% if product.available %}
  <button>Add to Cart</button>
{% elsif product.tags contains 'coming-soon' %}
  <p>Coming Soon</p>
{% else %}
  <p>Sold Out</p>
{% endif %}`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            {"{% unless %}"}
          </h3>
          <p className="mt-2 text-gray-700">
            Executes a block of code only if a condition is NOT met.
          </p>
          <CodeBlock
            code={`{% unless product.available %}
  <p>Not available</p>
{% endunless %}`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            {"{% case %}"} / {"{% when %}"}
          </h3>
          <p className="mt-2 text-gray-700">
            Creates a switch statement to compare a variable with different
            values.
          </p>
          <CodeBlock
            code={`{% case product.type %}
  {% when 'Shirt' %}
    This is a shirt
  {% when 'Pants' %}
    This is pants
  {% else %}
    This is something else
{% endcase %}`}
            language="liquid"
          />
        </section>

        {/* Loops */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Loops</h2>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            {"{% for %}"}
          </h3>
          <p className="mt-2 text-gray-700">
            Repeatedly executes a block of code for each item in an array.
          </p>
          <CodeBlock
            code={`{% for product in collection.products %}
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
{% endfor %}`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Loop Limits and Offset
          </h3>
          <p className="mt-2 text-gray-700">
            Control how many items to loop through or skip.
          </p>
          <CodeBlock
            code={`{% for product in collection.products limit:4 %}
  {{ product.title }}
{% endfor %}

{% for product in collection.products offset:2 %}
  {{ product.title }}
{% endfor %}`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Range Loop
          </h3>
          <p className="mt-2 text-gray-700">
            Loop through a range of numbers.
          </p>
          <CodeBlock
            code={`{% for i in (1..5) %}
  Item {{ i }}
{% endfor %}`}
            language="liquid"
          />
        </section>

        {/* Filters */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Filters</h2>
          <p className="mt-4 text-lg text-gray-700">
            Filters modify the output of variables. They are applied using the
            pipe character |.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            String Filters
          </h3>
          <CodeBlock
            code={`{{ 'hello world' | capitalize }}  → Hello world
{{ 'Hello World' | downcase }}     → hello world
{{ 'Hello World' | upcase }}       → HELLO WORLD
{{ 'Hello' | append: ' World' }}   → Hello World
{{ 'Hello World' | remove: 'World' }} → Hello 
{{ 'Hello World' | replace: 'World', 'There' }} → Hello There
{{ 'Hello World' | truncate: 8 }}  → Hello...`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Number Filters
          </h3>
          <CodeBlock
            code={`{{ 1999 | money }}                 → Rs. 1,999
{{ 1999 | money_with_currency }}  → Rs. 1,999 INR
{{ 4.5612 | round: 2 }}           → 4.56
{{ 16 | divided_by: 4 }}          → 4
{{ 5 | times: 2 }}                → 10
{{ 10 | minus: 5 }}               → 5
{{ 10 | plus: 5 }}                → 15`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Array Filters
          </h3>
          <CodeBlock
            code={`{{ collection.products | size }}        → Number of products
{{ collection.products | first }}      → First product
{{ collection.products | last }}       → Last product
{{ collection.products | join: ', ' }} → Comma-separated list
{{ collection.products | map: 'title' }} → Array of titles
{{ collection.products | where: 'available', true }} → Filter by condition
{{ collection.products | sort: 'price' }} → Sort array`}
            language="liquid"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Image & Asset Filters
          </h3>
          <CodeBlock
            code={`{{ 'style.css' | asset_url }}
{{ 'logo.png' | asset_url | img_tag }}
{{ product.url | within: collection }}
{{ product.featured_image | image_url: width: 300 }}
{{ product.featured_image | image_url: width: 500, height: 500 }}`}
            language="liquid"
          />
        </section>

        {/* Operators */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Operators</h2>
          <p className="mt-4 text-lg text-gray-700">
            Use operators in conditional statements to compare values.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="font-semibold text-text-primary">==</h4>
              <p className="mt-1 text-sm text-text-secondary">equals</p>
            </div>
            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="font-semibold text-text-primary">!=</h4>
              <p className="mt-1 text-sm text-text-secondary">does not equal</p>
            </div>
            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="font-semibold text-text-primary">&gt;</h4>
              <p className="mt-1 text-sm text-text-secondary">greater than</p>
            </div>
            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="font-semibold text-text-primary">&lt;</h4>
              <p className="mt-1 text-sm text-text-secondary">less than</p>
            </div>
            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="font-semibold text-text-primary">contains</h4>
              <p className="mt-1 text-sm text-text-secondary">
                checks if substring exists
              </p>
            </div>
            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="font-semibold text-text-primary">and / or</h4>
              <p className="mt-1 text-sm text-text-secondary">logical operators</p>
            </div>
          </div>
          <CodeBlock
            code={`{% if product.price > 100 and product.available %}
  Premium product available
{% endif %}

{% if product.tags contains 'sale' %}
  On sale!
{% endif %}`}
            language="liquid"
            className="mt-4"
          />
        </section>

        {/* Reference Link */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Official Reference</h2>
          <p className="mt-4 text-lg text-gray-700">
            For a complete reference of all Liquid tags, filters, and objects,
            visit the official Shopify cheat sheet:
          </p>
          <div className="mt-4">
            <a
              href="https://www.shopify.com/partners/shopify-cheat-sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-medium"
            >
              Shopify Liquid Cheat Sheet →
            </a>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
