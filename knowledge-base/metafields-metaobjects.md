---
title: Working with Metafields and Metaobjects for Custom Data
author: Priya Nair
tags: metafields, metaobjects, custom data, storefront API, admin API
date: 2026-01-10
---

# Working with Metafields and Metaobjects for Custom Data

## Overview

Metafields and Metaobjects are Shopify's system for storing custom data beyond the standard product/collection/order fields. We use them extensively for brand-specific requirements like size guides, ingredient lists, custom badges, and more.

## Metafields

### When to Use Metafields

- Extending existing resources (products, collections, customers, orders)
- Storing simple key-value data
- Data that belongs to a specific resource

### Creating Metafield Definitions via Admin API

```graphql
mutation CreateMetafieldDefinition {
  metafieldDefinitionCreate(
    definition: {
      name: "Care Instructions"
      namespace: "custom"
      key: "care_instructions"
      type: "multi_line_text_field"
      ownerType: PRODUCT
      description: "Product care and washing instructions"
      validations: [
        { name: "min", value: "10" }
        { name: "max", value: "500" }
      ]
    }
  ) {
    createdDefinition {
      id
      name
    }
    userErrors {
      field
      message
    }
  }
}
```

### Accessing Metafields in Liquid

```liquid
{% comment %} Direct access {% endcomment %}
{{ product.metafields.custom.care_instructions.value }}

{% comment %} With type-specific handling {% endcomment %}
{% assign care = product.metafields.custom.care_instructions %}
{% if care != blank %}
  <div class="care-instructions">
    {{ care.value | newline_to_br }}
  </div>
{% endif %}

{% comment %} JSON metafield {% endcomment %}
{% assign specs = product.metafields.custom.specifications.value %}
{% for spec in specs %}
  <dt>{{ spec.label }}</dt>
  <dd>{{ spec.value }}</dd>
{% endfor %}
```

### Accessing via Storefront API

```graphql
query GetProductMetafields($handle: String!) {
  product(handle: $handle) {
    title
    metafield(namespace: "custom", key: "care_instructions") {
      value
      type
    }
    metafields(identifiers: [
      { namespace: "custom", key: "care_instructions" },
      { namespace: "custom", key: "size_guide" }
    ]) {
      key
      value
      type
    }
  }
}
```

## Metaobjects

### When to Use Metaobjects

- Standalone content types (not attached to a product/collection)
- Reusable content entries (like team members, FAQs, store locations)
- Complex content with multiple fields

### Example: FAQ Metaobject

We created a FAQ system for a brand using metaobjects:

**1. Define the Metaobject:**

```graphql
mutation CreateFAQDefinition {
  metaobjectDefinitionCreate(
    definition: {
      name: "FAQ"
      type: "faq"
      fieldDefinitions: [
        { name: "Question", key: "question", type: "single_line_text_field", required: true }
        { name: "Answer", key: "answer", type: "multi_line_text_field", required: true }
        { name: "Category", key: "category", type: "single_line_text_field" }
        { name: "Sort Order", key: "sort_order", type: "number_integer" }
      ]
      access: { storefront: ACTIVE }
    }
  ) {
    metaobjectDefinition {
      id
      type
    }
  }
}
```

**2. Query FAQs in Storefront:**

```graphql
query GetFAQs {
  metaobjects(type: "faq", first: 50, sortKey: "updated_at") {
    nodes {
      fields {
        key
        value
      }
    }
  }
}
```

**3. Render in Liquid:**

```liquid
{% for faq in shop.metaobjects.faq.values %}
  <details class="faq-item">
    <summary>{{ faq.question.value }}</summary>
    <div class="faq-answer">
      {{ faq.answer.value | newline_to_br }}
    </div>
  </details>
{% endfor %}
```

## Best Practices

1. **Use `custom` namespace** — Keeps things organized and avoids conflicts with apps
2. **Always define metafield definitions** — Don't create metafields without definitions; merchants need the UI
3. **Choose correct types** — Use `json` for complex structures, `list.single_line_text_field` for arrays
4. **Storefront access** — Remember to enable storefront access for metafields/metaobjects you need in the theme
5. **Bulk operations** — For migrating data, use the Bulk Operations API instead of individual mutations
