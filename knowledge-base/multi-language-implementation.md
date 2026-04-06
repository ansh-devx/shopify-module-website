---
title: Implementing Multi-Language Support with LangShop on Shopify
author: Aditya Pasikanti
tags: multi-language, langshop, translations, shopify, liquid
date: 2026-04-03
---

# Implementing Multi-Language Support with LangShop on Shopify

## Overview

Vedic Lab is a multi-region Ayurvedic skincare and wellness brand that serves customers across different countries and languages. To provide a localized shopping experience, we implemented multi-language support using the **LangShop** app on Shopify. The store currently supports four languages:

- **English** (default)
- **German** (de)
- **French** (fr)
- **Italian** (it)

This document covers how LangShop works, its limitations, and how we built a lightweight internal solution to handle hardcoded text translations without impacting site performance.

---

## What is LangShop?

LangShop is a Shopify translation app that allows store owners to translate their storefront content into multiple languages. It provides a centralized interface for managing translations across the entire store.

### What LangShop Can Translate

LangShop offers translation support for a wide range of store content, including:

- **Section content** — Any text that comes through Shopify section schemas (headings, descriptions, button labels, etc.)
- **Products** — Product titles, descriptions, tags, and meta fields
- **Collections** — Collection titles and descriptions
- **Navigation menus** — Menu items and links
- **Images** — Serve different images per language (e.g., banners with localized text)
- **Videos** — Swap video content based on language
- **Pages and blog posts** — Static content pages and articles

### How LangShop Handles Translations

LangShop works by detecting the language from the URL path and serving the appropriate translated content. For example:

| URL | Language |
|-----|----------|
| `vediclab.com/products/face-oil` | English (default) |
| `vediclab.com/de/products/face-oil` | German |
| `vediclab.com/fr/products/face-oil` | French |
| `vediclab.com/it/products/face-oil` | Italian |

---

## The Key Rule: Content Must Come Through Section Schemas

For LangShop to detect and translate content, the text **must be defined in Shopify section schemas**. This means any text rendered through `{{ section.settings.heading }}`, `{{ block.settings.description }}`, or similar schema-driven settings will automatically appear in the LangShop translation interface.

**Hardcoded text in Liquid templates will not be detected by LangShop.**

For example, if a section has this in its schema:

```json
{
  "type": "text",
  "id": "heading",
  "label": "Heading",
  "default": "Our Bestsellers"
}
```

And is rendered as:

```liquid
<h2>{{ section.settings.heading }}</h2>
```

Then LangShop will pick it up and allow you to provide translations for it. But if the same text is hardcoded directly in the template:

```liquid
<h2>Our Bestsellers</h2>
```

LangShop will **not** detect it for translation.

---

## LangShop's Dynamic Texts Feature (And Why We Avoid It)

LangShop does offer a feature called **Dynamic Texts** to handle hardcoded text. Here is how it works:

1. You inspect the page in the browser and copy the hardcoded text from the DOM.
2. You paste it into the LangShop Dynamic Texts interface.
3. You provide translations for each language.
4. LangShop injects a JavaScript snippet on the storefront that finds and replaces those text strings at runtime.

### Why We Don't Use Dynamic Texts

While Dynamic Texts solves the translation problem, it comes with a significant **performance cost**:

- It loads additional JavaScript on every page to scan the DOM and replace text strings.
- The more Dynamic Text entries you add, the heavier the script becomes.
- This scanning and replacing happens on the client side, which can cause visible text flickering (the original text briefly appears before being swapped).
- It increases page load time, which directly impacts user experience and SEO rankings.

**Our recommendation: Do not use Dynamic Texts.** The performance trade-off is not worth it, especially for a storefront where page speed matters.

---

## Our Solution: The `multilingual-text` Snippet

Instead of relying on LangShop's Dynamic Texts, we built a simple, zero-overhead Liquid snippet that handles hardcoded text translations server-side. This means the correct language is rendered before the page reaches the browser — no extra JavaScript, no flickering, no performance impact.

### How It Works

The snippet lives at `snippets/multilingual-text.liquid` and checks the URL path to determine which language the user is viewing:

```liquid
{% if request.path contains '/de' %}
  {{ de_text }}
{% elsif request.path contains '/fr' %}
  {{ fr_text }}
{% elsif request.path contains '/it' %}
  {{ it_text }}
{% else %}
  {{ en_text }}
{% endif %}
```

- If the URL contains `/de`, it renders the German text.
- If the URL contains `/fr`, it renders the French text.
- If the URL contains `/it`, it renders the Italian text.
- Otherwise, it defaults to English.

### Usage Example

Wherever you have hardcoded text in a section or snippet, instead of writing:

```liquid
<h2>Our Bestsellers</h2>
```

You render the `multilingual-text` snippet and pass in the translations:

```liquid
<h2>
  {%- render 'multilingual-text',
    en_text: 'Our Bestsellers',
    de_text: 'Unsere Bestseller',
    fr_text: 'Nos best-sellers',
    it_text: 'I nostri bestseller'
  -%}
</h2>
```

The correct text is rendered server-side based on the current URL. No JavaScript involved.

### Benefits of This Approach

| Aspect | Dynamic Texts (LangShop) | `multilingual-text` Snippet |
|--------|--------------------------|----------------------------|
| Performance impact | Adds JavaScript to every page | Zero — rendered server-side |
| Text flickering | Yes — text swaps after page load | No — correct text rendered immediately |
| Scales with more translations | Script gets heavier | No impact on performance |
| Requires app dependency | Yes | No — pure Liquid |
| Setup complexity | Copy from DOM, paste in app | Pass text directly in Liquid |

---

## Best Practices

1. **Use section schemas wherever possible.** If content can be defined in a section schema setting, do that first. LangShop handles schema-based content natively and well.

2. **Use `multilingual-text` for hardcoded text.** For any text that must live in the template (labels, static headings, UI strings), use the snippet instead of Dynamic Texts.

3. **Always provide all four language versions.** When using the snippet, pass `en_text`, `de_text`, `fr_text`, and `it_text` to ensure every language is covered.

4. **English is the default.** If a translation is not yet available, the snippet will fall back to English. You can pass the English text for any language that is not yet translated.

---

## Summary

- **LangShop** is our translation app and works well for all schema-driven content (products, collections, menus, section settings, images, videos, etc.).
- **Hardcoded text** in templates is not detected by LangShop.
- **Dynamic Texts** (LangShop's solution for hardcoded text) should be avoided due to its negative performance impact.
- **`multilingual-text` snippet** is our internal, zero-cost solution for translating hardcoded text — it renders the right language server-side with no JavaScript overhead.
