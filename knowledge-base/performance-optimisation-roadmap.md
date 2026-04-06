---
title: Performance Optimisation Roadmap for Shopify Themes
author: Aditya Pasikanti
tags: performance, core web vitals, pagespeed, shopify, css, javascript, lazy loading, optimisation
date: 2026-04-03
---

# Performance Optimisation Roadmap for Shopify Themes

## Before You Begin

A suggestion from Aditya — **Patience. This is a Test match, not a T20.**

Performance optimisation is not a quick fix. It requires careful analysis, incremental changes, and repeated measurement. Do not rush. Take it step by step, measure after every change, and give yourself time to understand what is actually impacting the score before making changes.

---

## Step 1: Run PageSpeed Insights

Start by running your store's URL on [Google PageSpeed Insights (PSI)](https://pagespeed.web.dev/).

PSI will show you two things:

### Core Web Vitals (Real User Data)

This section shows how **real users** are experiencing your site. It reports pass/fail for both **Mobile** and **Desktop**.

- **If both Mobile and Desktop are green (passed)** — Real users are not facing performance issues. You may not need to do much here. The site is performing well in the real world.
- **If either is failing** — There are real performance problems that users are experiencing. Proceed with the optimisation roadmap below.

### Lab Data (Simulated Scores)

PSI provides four scores based on simulated testing:

| Score | What It Measures |
|-------|-----------------|
| **Performance** | Page speed, loading behaviour, interactivity, visual stability |
| **Accessibility** | How usable the site is for all users (screen readers, keyboard navigation, contrast, etc.) |
| **Best Practices** | Security, modern web standards, correct API usage |
| **SEO** | Search engine discoverability (meta tags, crawlability, structured data) |

---

## Step 2: Start with Accessibility, Best Practices, and SEO — Not Performance

This is important. **Do not jump straight to Performance.**

Start with the other three scores first:

1. **Accessibility**
2. **Best Practices**
3. **SEO**

### Why Start Here?

- These three scores are mostly about **first-party code** — things you have direct control over (HTML attributes, meta tags, alt text, contrast ratios, etc.).
- They are **easy wins** that can often be fixed quickly.
- Aim for **90+ on both Mobile and Desktop** for all three.

### Common Fixes

**Accessibility:**
- Add `alt` attributes to all images
- Ensure sufficient colour contrast between text and background
- Add `aria-label` to interactive elements like buttons and links that lack visible text
- Ensure proper heading hierarchy (`h1` → `h2` → `h3`, no skipping levels)
- Make sure form inputs have associated `<label>` elements

**Best Practices:**
- Use HTTPS for all resources (images, scripts, stylesheets)
- Avoid deprecated APIs or browser features flagged by PSI
- Ensure images have correct aspect ratios to avoid layout shifts

**SEO:**
- Add `<meta name="description">` to all pages
- Ensure all pages have a `<title>` tag
- Use proper canonical URLs
- Make sure the page is not accidentally blocked by `robots.txt` or `noindex` meta tags
- Use structured data where applicable (products, reviews, breadcrumbs)

### A Note on Performance

Making these three green **will not significantly improve your Performance score**. But that is not the point. These are foundational hygiene items that make the site better for users and search engines. Get them out of the way first so you can focus entirely on Performance without distractions.

---

## Step 3: Move to Performance

Once Accessibility, Best Practices, and SEO are all 90+, shift your focus to the Performance score.

### Understand the Metrics

PSI reports five key metrics under Performance:

| Metric | What It Measures | Why It Matters |
|--------|-----------------|----------------|
| **LCP** (Largest Contentful Paint) | Time until the largest visible element (usually hero image/video) finishes loading | Users perceive the page as "loaded" when the biggest element appears |
| **FCP** (First Contentful Paint) | Time until the first piece of content appears on screen | How quickly the user sees *something* instead of a blank page |
| **CLS** (Cumulative Layout Shift) | How much the page layout shifts unexpectedly during loading | Prevents annoying jumps where buttons or text move as the page loads |
| **SI** (Speed Index) | How quickly the visible area of the page is populated | Measures the overall visual loading experience |
| **TBT** (Total Blocking Time) | Total time the main thread is blocked by long tasks | Directly affects how responsive the page feels to clicks and taps |

Read the PSI insights deeply. They will tell you exactly which elements and resources are causing problems.

---

## Step 4: The Performance Optimisation Checklist

These are the common, high-impact optimisations that apply to virtually every Shopify store. Work through them in order.

### 4.1 Image Lazy Loading and Preloading

Images are typically the heaviest assets on any Shopify page.

**The rule is simple:**

- **Preload the LCP image** — The largest visible image in the first fold (hero banner, product featured image) should be preloaded with `fetchpriority="high"`. This tells the browser to download it as early as possible.
- **Lazy load everything else** — Every image below the first fold should use the native `loading="lazy"` attribute on the `<img>` tag. The browser will only load these images as the user scrolls near them.

**Preloading the LCP image:**

Add a `<link rel="preload">` in the `<head>` for the LCP image. This can be conditional based on the template:

```liquid
{% if template.name == 'index' %}
  <link
    rel="preload"
    as="image"
    href="{{ section_hero_image | image_url: width: 800, format: 'webp', quality: 80 }}"
    type="image/webp"
    fetchpriority="high"
  >
{% endif %}

{% if template.name == 'product' and product.featured_image %}
  <link
    rel="preload"
    as="image"
    href="{{ product.featured_image | image_url: width: 900, format: 'webp', quality: 80 }}"
    type="image/webp"
    fetchpriority="high"
  >
{% endif %}
```

On the `<img>` tag itself for the LCP image, set `fetchpriority="high"` and do **not** use `loading="lazy"`:

```html
<img
  src="hero-image.webp"
  alt="Hero banner"
  width="1200"
  height="600"
  fetchpriority="high"
>
```

**Lazy loading all other images:**

```html
<img
  src="product-image.webp"
  alt="Product name"
  width="400"
  height="400"
  loading="lazy"
>
```

That's it. The native `loading="lazy"` attribute is supported by all modern browsers and requires no JavaScript.

**Key points:**
- Only the LCP element gets `fetchpriority="high"` and preloading
- Everything else gets `loading="lazy"`
- Always set `width` and `height` attributes on images to prevent CLS (layout shifts)
- Serve images in WebP format where possible for smaller file sizes

---

### 4.2 Video Lazy Loading

Videos are even heavier than images. Never load a video eagerly unless it is the LCP element.

**Every video should have a poster thumbnail.** This is a static image that displays before the video loads. Without a poster, the browser either shows a blank box or downloads the video immediately.

**Lazy load videos using an IntersectionObserver pattern:**

The idea is straightforward — don't set the video `src` until the user scrolls near it. Use `data-src` on the `<source>` tag instead of `src`, and swap it when the video enters the viewport.

**Example snippet (Liquid):**

```liquid
{%- assign is_lazy = true -%}

<video
  preload="none"
  class="lazy-video"
  loop
  muted
  playsinline
  autoplay
  poster="{{ poster_image_url }}"
  width="800"
  height="450"
>
  <source data-src="{{ video_url }}" type="video/mp4">
</video>
```

**Example script (JavaScript):**

```javascript
const lazyVideos = Array.from(document.querySelectorAll("video.lazy-video"));

if ("IntersectionObserver" in window) {
  const lazyVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        const sources = video.querySelectorAll("source");
        sources.forEach((source) => {
          if (source.dataset.src) {
            source.src = source.dataset.src;
          }
        });

        video.muted = true;
        video.load();
        video.play().catch(() => {});

        video.classList.remove("lazy-video");
        lazyVideoObserver.unobserve(video);
      } else {
        if (video && !video.paused) {
          video.pause();
        }
      }
    });
  });

  lazyVideos.forEach((lazyVideo) => {
    lazyVideoObserver.observe(lazyVideo);
  });
}
```

This ensures videos only download and play when the user actually scrolls to them.

As a reference, Vedic Lab has this built into reusable snippets — `snippets/lazy-video.liquid` for the markup and `assets/lazy-video.js` for the IntersectionObserver logic.

---

### 4.3 CSS Prioritisation

CSS is render-blocking by default. If you load all your stylesheets in the `<head>` normally, the browser will not paint anything until every CSS file is downloaded and parsed. This directly hurts FCP and LCP.

**The rule:**

- **Preload only the CSS needed for the first fold** — The sections visible without scrolling (header, hero banner) need their CSS immediately. Load these with a standard stylesheet tag.
- **Defer everything else** — All CSS for below-the-fold sections should be loaded non-render-blocking using the `media="print"` trick.

**How the `media="print"` trick works:**

```liquid
{% comment %} Render-blocking: loads immediately (use for first fold CSS) {% endcomment %}
<link rel="stylesheet" href="base.css">

{% comment %} Non-render-blocking: deferred until after page paint {% endcomment %}
<link
  rel="stylesheet"
  href="section-below-fold.css"
  media="print"
  onload="this.onload=null;this.media='all';"
>
<noscript><link rel="stylesheet" href="section-below-fold.css"></noscript>
```

When `media="print"` is set, the browser downloads the file at low priority but does not block rendering. Once the file is loaded, the `onload` handler switches `media` to `all`, applying the styles. The `<noscript>` fallback ensures the CSS still loads if JavaScript is disabled.

**Create a reusable snippet for this.** As a reference, Vedic Lab uses a `lazy-css` snippet that accepts a `filename` and a `loading` parameter:

```liquid
{% assign css_url = filename | asset_url %}

{% if loading == 'preload' %}
  {{ filename | asset_url | stylesheet_tag: preload: true }}

{% elsif loading == 'low' %}
  <link
    rel="stylesheet"
    href="{{ css_url }}"
    media="print"
    onload="this.onload=null;this.media='all';"
  >
  <noscript><link rel="stylesheet" href="{{ css_url }}"></noscript>

{% endif %}
```

Usage in a section:

```liquid
{% comment %} First fold section: preload its CSS {% endcomment %}
{%- render 'lazy-css', filename: 'hero-banner-stylesheet.css', loading: 'preload' -%}

{% comment %} Below fold section: defer its CSS {% endcomment %}
{%- render 'lazy-css', filename: 'testimonials-stylesheet.css', loading: 'low' -%}
```

**Key points:**
- Audit every `<link rel="stylesheet">` in your theme — if it is not needed for the first fold, defer it
- Never leave stylesheets render-blocking unless they are critical for the initial paint
- Each section should load its own CSS using the snippet, so only the sections on the page load their CSS

---

### 4.4 JavaScript Deferring

Like CSS, JavaScript can be render-blocking. Scripts in the `<head>` without `defer` or `async` will block the browser from parsing HTML until they are downloaded and executed. This directly increases TBT and slows down FCP.

**The rule:**

- **Defer all first-party scripts** — Use the `defer` or `async` attribute on every script tag.
- **Never leave a script render-blocking** unless it absolutely must run before the page paints (this is rare).

**Difference between `defer` and `async`:**

| Attribute | Download | Execution |
|-----------|----------|-----------|
| *(none)* | Blocks HTML parsing | Runs immediately — **render-blocking** |
| `defer` | Parallel with HTML parsing | Runs after HTML is fully parsed, in order |
| `async` | Parallel with HTML parsing | Runs as soon as downloaded, not in order |

- Use `defer` for scripts that depend on the DOM or need to run in order.
- Use `async` for independent scripts that don't depend on other scripts or the DOM.

**Create a reusable snippet for this.** As a reference, Vedic Lab uses a `lazy-js` snippet:

```liquid
{% assign js_url = filename | asset_url %}

{% if loading == 'defer' %}
  <script src="{{ js_url }}" defer></script>

{% elsif loading == 'async' %}
  <script src="{{ js_url }}" async></script>

{% endif %}
```

Usage in a section:

```liquid
{%- render 'lazy-js', filename: 'carousel-javascript.js', loading: 'defer' -%}
```

**Key points:**
- Audit every `<script>` tag in your theme — if it lacks `defer` or `async`, it is render-blocking
- Section-specific JS should be loaded by the section itself using the snippet
- jQuery and other libraries should be deferred if possible

---

### 4.5 Structuring `theme.liquid`

The `layout/theme.liquid` file is the single entry point of a Shopify theme. Everything passes through it. If this file is bloated with inline scripts, styles, and third-party tags all mixed together, it becomes difficult to manage and easy to accidentally introduce render-blocking resources.

**The approach: Break `theme.liquid` into organized, named snippets.**

Instead of writing everything inline in theme.liquid, extract each logical group into its own snippet. This makes the file readable, maintainable, and makes it clear what loads where and in what order.

**Recommended structure:**

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    {% comment %} Meta tags {% endcomment %}
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {% render 'meta-tags' %}

    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>

    <title>{{ page_title }}</title>
    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {% comment %} LCP image preloads {% endcomment %}
    {% render 'image-preloads' %}

    {% comment %} Core JS (jQuery, libraries, global scripts — all deferred) {% endcomment %}
    {% render 'core-assets' %}

    {% comment %} Font loading {% endcomment %}
    {% render 'font-loading' %}

    {% comment %} Favicon {% endcomment %}
    {% render 'favicon' %}

    {% comment %} Template-aware CSS routing {% endcomment %}
    {% render 'custom-css' %}

    {% comment %} Deferred/lazy script loading {% endcomment %}
    {% render 'lazy-script' %}

    {% comment %} DOM-dependent scripts {% endcomment %}
    {% render 'dom-load-scripts' %}

    {% comment %} Third-party tags (keep above content_for_header) {% endcomment %}
    {% render 'third-party-tags' %}

    {% comment %} Shopify's required tag — ALWAYS KEEP THIS LAST in <head> {% endcomment %}
    {{ content_for_header }}
  </head>

  <body>
    {% comment %} Skip to content (accessibility) {% endcomment %}
    <a class="skip-to-content-link button visually-hidden" href="#MainContent">
      {{ 'accessibility.skip_to_text' | t }}
    </a>

    {% comment %} Header {% endcomment %}
    {% sections 'header-group' %}

    {% comment %} Overlays (modals, drawers) {% endcomment %}
    {% sections 'overlay-group' %}

    {% comment %} Main content {% endcomment %}
    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    {% comment %} Cart drawer {% endcomment %}
    {%- render 'cart-drawer' -%}

    {% comment %} Theme globals {% endcomment %}
    {% render 'shopify-theme-globals' %}

    {% comment %} Cookie consent {% endcomment %}
    {% render 'cookie-consent' %}

    {% comment %} Conditional/page-specific assets {% endcomment %}
    {% render 'conditional-assets' %}
  </body>
</html>
```

This is modelled on Vedic Lab's `theme.liquid`, which follows this pattern in production.

**Key principles:**

- **Each snippet has a single responsibility** — `image-preloads` only handles preloading LCP images, `custom-css` only handles CSS routing, `core-assets` only handles the JS bootstrap.
- **The `<head>` follows a deliberate order** — meta tags first, then preloads, then CSS, then scripts, then third-party tags, and `{{ content_for_header }}` always last.
- **`{{ content_for_header }}` must be the last thing in `<head>`** — This is Shopify's required tag that injects app scripts and Shopify's own scripts. Keeping it at the bottom ensures your critical resources (preloads, CSS) are declared before Shopify's injected scripts.
- **Third-party scripts go above `{{ content_for_header }}`** — Load your third-party tracking/analytics scripts (GTM, Klaviyo, Hotjar, etc.) above `content_for_header` so they are grouped together and not scattered throughout the file.
- **The `<body>` is equally organized** — Header group, main content, then deferred elements (drawers, modals, global scripts, conditional assets) at the bottom.

---

### 4.6 Use Liquid Comments, Not HTML Comments

This is a small but important detail that directly impacts performance.

**Never use HTML comments in Liquid files:**

```html
<!-- This is an HTML comment — DO NOT use this in .liquid files -->
```

HTML comments (`<!-- -->`) are sent to the browser as part of the page's HTML. They add bytes to the response, increase the document size, and are visible to anyone who views the page source. They serve no purpose in production and are dead weight.

**Always use Liquid comments instead:**

```liquid
{% comment %} This is a Liquid comment — use this {% endcomment %}
```

Liquid comments are processed on the server and **completely stripped from the output**. They never reach the browser. Zero bytes added. Nothing in the page source.

**The difference:**

| Comment Type | Sent to Browser | Visible in Page Source | Adds to Page Size |
|-------------|----------------|----------------------|-------------------|
| `<!-- HTML comment -->` | Yes | Yes | Yes |
| `{% comment %} Liquid comment {% endcomment %}` | No | No | No |

On a theme with dozens of sections, snippets, and templates, HTML comments scattered across the codebase can collectively add up to unnecessary kilobytes sent on every page load. Switch every HTML comment in your `.liquid` files to Liquid comments.

---

## Summary — The Optimisation Order

| Step | Action | Target |
|------|--------|--------|
| 1 | Run PageSpeed Insights | Understand the current state |
| 2 | Check Core Web Vitals | Decide if optimisation is needed (green = low priority) |
| 3 | Fix Accessibility, Best Practices, SEO | Get all three to 90+ (easy wins, first-party fixes) |
| 4 | Lazy load images | Use native `loading="lazy"` on all non-LCP images |
| 5 | Preload LCP image | `<link rel="preload">` + `fetchpriority="high"` |
| 6 | Lazy load videos | IntersectionObserver + poster thumbnails |
| 7 | Defer CSS | `media="print"` trick for all below-fold stylesheets |
| 8 | Defer JavaScript | `defer`/`async` on all script tags |
| 9 | Structure theme.liquid | Break into named snippets, keep `content_for_header` last |
| 10 | Use Liquid comments | Replace all HTML comments with `{% comment %}` in `.liquid` files |
| 11 | Re-measure | Run PSI again and iterate |

**Remember: Patience. Measure, change one thing, measure again. Repeat.**
