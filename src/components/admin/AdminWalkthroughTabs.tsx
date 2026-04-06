"use client";

import { useEffect, useId, useMemo, useState } from "react";
import CodeBlock from "@/components/code-block/CodeBlock";
import { cn } from "@/lib/utils";

type TabKey =
  | "products"
  | "orders"
  | "collections"
  | "online-store"
  | "content"
  | "menus"
  | "analytics"
  | "discounts";

const PRODUCTS_QUERY = `query Products($first: Int!, $query: String) {
  products(first: $first, query: $query) {
    nodes {
      id
      title
      handle
      status
    }
  }
}`;

const PRODUCTS_QUERY_VARIABLES = `{
  "first": 10,
  "query": "status:active"
}`;

const PRODUCT_WITH_VARIANTS_QUERY = `query ProductWithVariants($id: ID!) {
  product(id: $id) {
    id
    title
    handle
    variants(first: 10) {
      nodes {
        id
        title
        sku
        price
      }
    }
  }
}`;

const PRODUCT_WITH_VARIANTS_VARIABLES = `{
  "id": "gid://shopify/Product/1234567890"
}`;

const PRODUCT_CREATE_MUTATION = `mutation CreateProduct($product: ProductCreateInput!) {
  productCreate(product: $product) {
    product {
      id
      title
      handle
      status
    }
    userErrors {
      field
      message
    }
  }
}`;

const PRODUCT_CREATE_VARIABLES = `{
  "product": {
    "title": "New Product",
    "descriptionHtml": "<p>Product description</p>",
    "status": "DRAFT"
  }
}`;

const PRODUCT_UPDATE_MUTATION = `mutation UpdateProduct($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product {
      id
      title
      handle
      status
    }
    userErrors {
      field
      message
    }
  }
}`;

const PRODUCT_UPDATE_VARIABLES = `{
  "product": {
    "id": "gid://shopify/Product/1234567890",
    "title": "Updated Product Title",
    "status": "ACTIVE"
  }
}`;

export default function AdminWalkthroughTabs() {
  const tabs = useMemo(
    () => [
      { key: "products" as const, label: "Products" },
      { key: "collections" as const, label: "Collections" },
      { key: "orders" as const, label: "Orders" },
      { key: "discounts" as const, label: "Discounts" },
      { key: "online-store" as const, label: "Online Store" },
      { key: "content" as const, label: "Content / Files" },
      { key: "menus" as const, label: "Menus" },
      { key: "analytics" as const, label: "Analytics" },
    ],
    []
  );

  const [active, setActive] = useState<TabKey>("products");
  const uid = useId();

  useEffect(() => {
    const raw = window.location.hash.replace("#", "");
    const match = tabs.find((t) => t.key === (raw as TabKey));
    if (match) setActive(match.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Keep the selected tab in the URL for easy sharing.
    window.history.replaceState(null, "", `#${active}`);
  }, [active]);

  return (
    <div className="rounded-xl border border-accent/10 bg-surface-1 p-4">
      <div
        role="tablist"
        aria-label="Shopify admin areas"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              id={`${uid}-${tab.key}-tab`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${uid}-${tab.key}-panel`}
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "bg-surface-2 text-text-primary"
                  : "text-gray-700 hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-accent/10 bg-surface-2 p-6">
        {active === "products" && (
          <div
            id={`${uid}-products-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-products-tab`}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-text-primary">
                Products (end-to-end)
              </h3>
              <p className="mt-2 text-gray-700">
                Navigation: Left Sidebar → <b>Products</b>
              </p>
              <p className="mt-3 text-gray-700">
                Products are the foundation of your store. Most product changes
                fall into 3 buckets: <b>content</b> (title/description/media),
                <b> commerce</b> (pricing/variants/inventory), and{" "}
                <b>publishing</b>
                (status + sales channels).
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
                <h4 className="text-lg font-semibold text-text-primary">
                  Edit an existing product (UI flow)
                </h4>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700">
                  <li>
                    Find the product using search, filters, and saved views.
                  </li>
                  <li>
                    Update <b>Title</b> and <b>Description</b> (this affects how
                    it appears on the product page and in search).
                  </li>
                  <li>
                    Add/update <b>Media</b> (images/video). Reorder for the best
                    first impression.
                  </li>
                  <li>
                    Set <b>Pricing</b> (Price, Compare-at price). Decide if you
                    want a “sale” presentation.
                  </li>
                  <li>
                    Configure <b>Inventory</b>: SKU, tracking, and quantities at
                    each location.
                  </li>
                  <li>
                    Manage <b>Variants</b> (size/color/etc). Each variant can
                    have its own SKU, barcode, price, and inventory.
                  </li>
                  <li>
                    Set <b>Organization</b>: product type, vendor, tags, and
                    collections.
                  </li>
                  <li>
                    Confirm <b>Status</b> (Draft/Active/Archived) and product
                    availability per sales channel.
                  </li>
                  <li>
                    Edit <b>Search engine listing</b> (SEO title/description and
                    URL handle).
                  </li>
                  <li>
                    Click <b>Save</b>. (Pro-tip: if you changed
                    options/variants, double-check pricing and inventory for
                    every variant.)
                  </li>
                </ol>
              </div>

              <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
                <h4 className="text-lg font-semibold text-text-primary">
                  Create a new product (UI flow)
                </h4>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700">
                  <li>
                    Click <b>Add product</b>.
                  </li>
                  <li>
                    Fill in <b>Title</b>, <b>Description</b>, and add media.
                  </li>
                  <li>
                    Decide if it has <b>variants</b>. If yes, define options
                    (e.g., Size, Color) early.
                  </li>
                  <li>
                    Set prices and inventory details (per variant if
                    applicable).
                  </li>
                  <li>
                    Add organization metadata (tags/type/vendor) and assign to
                    collections.
                  </li>
                  <li>
                    Set status to <b>Draft</b> while you build, then{" "}
                    <b>Active</b>
                    when ready.
                  </li>
                </ol>

                <div className="mt-4 rounded-lg border border-accent/10 bg-surface-2 p-3 text-sm text-gray-700">
                  <b>Common gotcha:</b> If you change product options after
                  having many variants, Shopify may regenerate variants. Always
                  review variant-level price/SKU/inventory after option changes.
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/10 bg-surface-1 p-4">
              <h4 className="text-lg font-semibold text-text-primary">
                Basic Admin GraphQL (products)
              </h4>
              <p className="mt-2 text-gray-700">
                These examples use the Admin GraphQL API. You&apos;ll typically
                need app scopes like{" "}
                <code className="inline-flex items-center rounded-md border border-accent/10 bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                  read_products
                </code>{" "}
                and{" "}
                <code className="inline-flex items-center rounded-md border border-accent/10 bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                  write_products
                </code>
                .
              </p>

              <div className="mt-4 grid gap-6">
                <div>
                  <p className="mb-2 text-sm font-semibold text-text-primary">
                    1) List products (with search)
                  </p>
                  <CodeBlock code={PRODUCTS_QUERY} language="graphql" />
                  <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Variables
                  </p>
                  <CodeBlock code={PRODUCTS_QUERY_VARIABLES} language="json" />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-text-primary">
                    2) Fetch a product + its variants
                  </p>
                  <CodeBlock
                    code={PRODUCT_WITH_VARIANTS_QUERY}
                    language="graphql"
                  />
                  <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Variables
                  </p>
                  <CodeBlock
                    code={PRODUCT_WITH_VARIANTS_VARIABLES}
                    language="json"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-text-primary">
                    3) Create a product
                  </p>
                  <CodeBlock
                    code={PRODUCT_CREATE_MUTATION}
                    language="graphql"
                  />
                  <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Variables
                  </p>
                  <CodeBlock code={PRODUCT_CREATE_VARIABLES} language="json" />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-text-primary">
                    4) Update a product
                  </p>
                  <CodeBlock
                    code={PRODUCT_UPDATE_MUTATION}
                    language="graphql"
                  />
                  <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Variables
                  </p>
                  <CodeBlock code={PRODUCT_UPDATE_VARIABLES} language="json" />
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "collections" && (
          <div
            id={`${uid}-collections-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-collections-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">Collections</h3>
            <p className="text-gray-700">
              Navigation: Products → <b>Collections</b>
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <b>Manual</b>: you choose which products are in the collection.
              </li>
              <li>
                <b>Automated</b>: products are included by rules (tags, product
                type, price, vendor, etc.).
              </li>
              <li>
                Collections are commonly used to build navigation and
                merchandising on the storefront.
              </li>
            </ul>
          </div>
        )}

        {active === "orders" && (
          <div
            id={`${uid}-orders-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-orders-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">Orders</h3>
            <p className="text-gray-700">
              Navigation: Left Sidebar → <b>Orders</b>
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>View and process orders, refunds, and cancellations.</li>
              <li>Manage fulfillment and add tracking.</li>
              <li>Use tags and filters to organize high-volume workflows.</li>
            </ul>
          </div>
        )}

        {active === "discounts" && (
          <div
            id={`${uid}-discounts-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-discounts-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">Discounts</h3>
            <p className="text-gray-700">
              Navigation: Left Sidebar → <b>Discounts</b>
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Discount codes vs automatic discounts.</li>
              <li>
                Target products/collections, minimum requirements, and limits.
              </li>
              <li>
                Be careful with stacking rules when multiple discounts can
                apply.
              </li>
            </ul>
          </div>
        )}

        {active === "online-store" && (
          <div
            id={`${uid}-online-store-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-online-store-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">Online Store</h3>
            <p className="text-gray-700">
              Navigation: Left Sidebar → <b>Online Store</b>
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Theme editor: customize layout, sections, and colors.</li>
              <li>Pages and blog content live here for the storefront.</li>
              <li>Customize navigation and menus (often linked from here).</li>
            </ul>
          </div>
        )}

        {active === "content" && (
          <div
            id={`${uid}-content-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-content-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">
              Content / Files
            </h3>
            <p className="text-gray-700">
              Navigation: Left Sidebar → <b>Content</b> → Files
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Central place for uploaded media and documents.</li>
              <li>
                Use Files URLs inside product descriptions, theme sections, and
                pages.
              </li>
              <li>Keep file names organized for easy searching later.</li>
            </ul>
          </div>
        )}

        {active === "menus" && (
          <div
            id={`${uid}-menus-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-menus-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">Menus</h3>
            <p className="text-gray-700">
              Navigation: Left Sidebar → <b>Content</b> → Menus
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Main menu (header) and footer menu are common defaults.</li>
              <li>Menus can link to products, collections, pages, or URLs.</li>
              <li>Drag and drop to reorder.</li>
            </ul>
          </div>
        )}

        {active === "analytics" && (
          <div
            id={`${uid}-analytics-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-analytics-tab`}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold text-text-primary">Analytics</h3>
            <p className="text-gray-700">
              Navigation: Left Sidebar → <b>Analytics</b>
            </p>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Dashboards and reports for sales, traffic, and conversion.
              </li>
              <li>Use date ranges and comparisons to spot trends.</li>
              <li>
                Top products and acquisition channels are key starting points.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
