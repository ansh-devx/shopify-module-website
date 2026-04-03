---
title: Building Custom Liquid Sections for Shopify Themes
author: Aditya Pasikanti
tags: liquid, sections, schema, shopify themes, customization
date: 2025-11-20
---

# Building Custom Liquid Sections for Shopify Themes

## Overview

Liquid sections are the building blocks of Shopify themes. They allow merchants to customize their storefront through the theme editor. This guide covers how we build reusable, dynamic sections for client brands.

## Section Structure

Every section follows this structure:

```liquid
{% schema %}
{
  "name": "Section Name",
  "settings": [],
  "blocks": [],
  "presets": []
}
{% endschema %}

{% stylesheet %}
{% endstylesheet %}

{% javascript %}
{% endjavascript %}
```

## Key Patterns We Use

### 1. Dynamic Block Rendering

Instead of hardcoding content, we use blocks to let merchants add/remove/reorder content:

```liquid
{% for block in section.blocks %}
  {% case block.type %}
    {% when 'heading' %}
      <h2 {{ block.shopify_attributes }}>{{ block.settings.heading }}</h2>
    {% when 'text' %}
      <p {{ block.shopify_attributes }}>{{ block.settings.text }}</p>
    {% when 'button' %}
      <a href="{{ block.settings.link }}" class="btn" {{ block.shopify_attributes }}>
        {{ block.settings.label }}
      </a>
  {% endcase %}
{% endfor %}
```

### 2. Responsive Image Handling

We always use `image_tag` with srcset for performance:

```liquid
{% if section.settings.image != blank %}
  {{ section.settings.image | image_url: width: 1200 | image_tag:
    loading: 'lazy',
    widths: '300, 600, 900, 1200',
    sizes: '(max-width: 768px) 100vw, 50vw'
  }}
{% endif %}
```

### 3. Section Settings with Sensible Defaults

```json
{
  "type": "color",
  "id": "background_color",
  "label": "Background Color",
  "default": "#ffffff"
},
{
  "type": "range",
  "id": "padding_top",
  "min": 0,
  "max": 100,
  "step": 4,
  "unit": "px",
  "label": "Top Padding",
  "default": 40
}
```

## Common Pitfalls

1. **Not handling blank states** — Always check `{% if setting != blank %}` before rendering
2. **Missing `shopify_attributes`** — Required on blocks for theme editor to work
3. **Hardcoded strings** — Use `t` filter for translations: `{{ 'sections.header.title' | t }}`
4. **Large images** — Always use responsive image loading with `image_url` filter

## When to Use Sections vs Snippets

- **Sections**: For content areas merchants need to customize (hero banners, featured products, testimonials)
- **Snippets**: For reusable code fragments that don't need merchant customization (product card, price display)
