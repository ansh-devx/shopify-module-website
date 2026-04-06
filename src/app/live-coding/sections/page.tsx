import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function SectionsPage() {
  return (
    <ContentLayout
      title="Sections & Schema"
      description="Learn how to create customizable sections with schema in Shopify themes"
    >
      <div className="space-y-8">
        {/* What are Sections */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">What are Sections?</h2>
          <p className="mt-4 text-lg text-gray-700">
            Sections are reusable modules of content that can be added, removed,
            and reordered by merchants using the theme editor. They make your
            theme customizable without editing code.
          </p>
        </section>

        {/* Creating a Section */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Creating a Section</h2>
          <p className="mt-4 text-lg text-gray-700">
            Sections are stored in the{" "}
            <code className="rounded bg-surface-2 px-2 py-1 text-sm">
              sections/
            </code>{" "}
            directory and have a{" "}
            <code className="rounded bg-surface-2 px-2 py-1 text-sm">
              .liquid
            </code>{" "}
            extension.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Example: Hero Section
          </h3>
          <CodeBlock
            code={`<div class="hero-section" style="background-color: {{ section.settings.background_color }};">
  <div class="container">
    <h1>{{ section.settings.heading }}</h1>
    <p>{{ section.settings.subheading }}</p>
    <a href="{{ section.settings.button_link }}" class="btn">
      {{ section.settings.button_text }}
    </a>
  </div>
</div>

{% schema %}
{
  "name": "Hero Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Welcome to Our Store"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Discover amazing products"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Shop Now"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Button Link"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background Color",
      "default": "#000000"
    }
  ],
  "presets": [
    {
      "name": "Hero Section"
    }
  ]
}
{% endschema %}`}
            language="liquid"
            filename="sections/hero.liquid"
          />
        </section>

        {/* Schema */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Section Schema</h2>
          <p className="mt-4 text-lg text-gray-700">
            The schema makes your section customizable in the Shopify theme
            editor without editing code. It defines what settings merchants can
            edit.
          </p>
          <p className="mt-4 text-lg text-gray-700">
            The schema is defined in a{" "}
            <code className="rounded bg-surface-2 px-2 py-1 text-sm">
              {"{% schema %}"}
            </code>{" "}
            block at the end of your section file.
          </p>
        </section>

        {/* Blocks */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Blocks</h2>
          <p className="mt-4 text-lg text-gray-700">
            Blocks are repeatable content units within a section. They allow
            merchants to add multiple instances of similar content, like adding
            multiple feature cards to a features section.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Example: Features Section with Blocks
          </h3>
          <CodeBlock
            code={`<div class="features-section">
  <h2>{{ section.settings.title }}</h2>
  <div class="features-grid">
    {% for block in section.blocks %}
      <div class="feature-item" {{ block.shopify_attributes }}>
        {% if block.settings.icon %}
          <img src="{{ block.settings.icon | image_url: width: 100 }}" alt="{{ block.settings.title }}">
        {% endif %}
        <h3>{{ block.settings.title }}</h3>
        <p>{{ block.settings.description }}</p>
      </div>
    {% endfor %}
  </div>
</div>

{% schema %}
{
  "name": "Features Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Section Title",
      "default": "Our Features"
    }
  ],
  "blocks": [
    {
      "type": "feature",
      "name": "Feature",
      "settings": [
        {
          "type": "image_picker",
          "id": "icon",
          "label": "Icon"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Feature Title"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "Description"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Features Section",
      "blocks": [
        {
          "type": "feature"
        },
        {
          "type": "feature"
        },
        {
          "type": "feature"
        }
      ]
    }
  ]
}
{% endschema %}`}
            language="liquid"
            filename="sections/features.liquid"
          />
        </section>
      </div>
    </ContentLayout>
  );
}
