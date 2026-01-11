import { navigationStructure, NavigationItem } from "./navigation";
import { SearchableItem } from "./searchIndex";

/**
 * Build a searchable index from the navigation structure
 * This creates a flat array of all searchable pages with their metadata
 */
export function buildSearchIndex(): SearchableItem[] {
  const searchIndex: SearchableItem[] = [];

  function processItem(
    item: NavigationItem,
    breadcrumb: string[] = [],
    category: string = ""
  ) {
    // Determine category (top-level item title)
    const currentCategory = category || item.title;
    const currentBreadcrumb = [...breadcrumb, item.title];

    // If item has a href, add it to search index
    if (item.href && !item.isExternal) {
      searchIndex.push({
        id: item.id,
        title: item.title,
        href: item.href,
        category: currentCategory,
        breadcrumb: currentBreadcrumb,
        keywords: generateKeywords(item.title, currentBreadcrumb),
        icon: item.icon,
        content: getPageContent(item.id, item.href),
      });
    }

    // Process children recursively
    if (item.children) {
      item.children.forEach((child) => {
        processItem(child, currentBreadcrumb, currentCategory);
      });
    }
  }

  // Process all top-level navigation items
  navigationStructure.forEach((item) => {
    processItem(item);
  });

  return searchIndex;
}

/**
 * Generate search keywords from title and breadcrumb
 */
function generateKeywords(title: string, breadcrumb: string[]): string[] {
  const keywords = new Set<string>();

  // Add title words
  title.split(/\s+/).forEach((word) => keywords.add(word.toLowerCase()));

  // Add breadcrumb words
  breadcrumb.forEach((crumb) => {
    crumb.split(/\s+/).forEach((word) => keywords.add(word.toLowerCase()));
  });

  return Array.from(keywords);
}

/**
 * Get page content for search indexing
 * This is a simplified version - in a real implementation,
 * you might want to extract actual page content from MDX files
 */
function getPageContent(id: string, href: string): string {
  // Map of page IDs to their searchable content
  const pageContent: Record<string, string> = {
    overview: "Shopify learning platform master development e-commerce",
    "what-is-shopify":
      "Shopify platform global growth e-commerce solution online store",
    "partners-dashboard":
      "Partners dashboard navigate accept store organization invitations",
    "store-admin":
      "Admin panel features products orders customers settings theme",
    "cli-prerequisites": "Prerequisites requirements Node.js Ruby development",
    "cli-installation": "Installation setup Shopify CLI command line tools",
    "cli-getting-started": "Getting started CLI commands theme development",
    "workshop-setup": "Workshop setup IDE Visual Studio Code extensions",
    sections: "Sections schema customizable theme editor liquid",
    snippets: "Snippets reusable liquid code templates",
    templates: "Templates JSON structure page types product collection",
    "product-object": "Product object liquid variables properties",
    "price-filters": "Price filters money formatting currency",
    metafields: "Metafields custom data metadata",
    metaobjects: "Metaobjects custom content types",
    github: "GitHub configuration version control git integration",
    "liquid-cheatsheet":
      "Liquid cheatsheet templating language syntax filters tags",
    "cart-apis": "Cart APIs AJAX section rendering dynamic shopping",
    "shopify-functions":
      "Shopify Functions backend logic customization discounts",
    "post-purchase": "Post purchase order processing flow automation",
    "shopify-apps": "Shopify apps build deploy monetize development",
  };

  return pageContent[id] || "";
}

/**
 * Get popular/recommended pages to show initially
 */
export function getPopularPages(): SearchableItem[] {
  const allPages = buildSearchIndex();

  // Define popular page IDs
  const popularIds = [
    "what-is-shopify",
    "store-admin",
    "cli-installation",
    "liquid-cheatsheet",
    "sections",
    "cart-apis",
  ];

  return allPages.filter((page) => popularIds.includes(page.id));
}

