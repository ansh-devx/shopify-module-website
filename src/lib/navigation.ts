import {
  Home,
  Store,
  Settings,
  Terminal,
  Code,
  ShoppingCart,
  Zap,
  CreditCard,
  Package,
  BookOpen,
  FileCode,
  Database,
  Layout,
  Box,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavigationItem[];
  isExternal?: boolean;
}

export const navigationStructure: NavigationItem[] = [
  {
    id: "overview",
    title: "Overview",
    href: "/",
    icon: Home,
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    children: [
      {
        id: "what-is-shopify",
        title: "What is Shopify",
        href: "/what-is-shopify",
      },
      {
        id: "partners-dashboard",
        title: "Partners Dashboard",
        href: "/partners-dashboard",
      },
      {
        id: "store-admin",
        title: "Store Admin",
        href: "/store-admin",
      },
    ],
  },
  {
    id: "shopify-cli",
    title: "Shopify CLI",
    icon: Terminal,
    children: [
      {
        id: "cli-prerequisites",
        title: "Prerequisites",
        href: "/cli-setup/prerequisites",
      },
      {
        id: "cli-installation",
        title: "Installation",
        href: "/cli-setup/installation",
      },
      {
        id: "cli-getting-started",
        title: "Getting Started",
        href: "/cli-setup/getting-started",
      },
    ],
  },
  {
    id: "live-coding",
    title: "Live Coding Workshop",
    icon: Code,
    children: [
      {
        id: "workshop-setup",
        title: "Workshop Setup",
        href: "/live-coding/setup",
      },
      {
        id: "sections",
        title: "Sections & Schema",
        href: "/live-coding/sections",
      },
      {
        id: "snippets",
        title: "Snippets",
        href: "/live-coding/snippets",
      },
      {
        id: "templates",
        title: "Templates",
        href: "/live-coding/templates",
      },
      {
        id: "product-object",
        title: "Product Object",
        href: "/live-coding/product-object",
      },
      {
        id: "price-filters",
        title: "Price Filters",
        href: "/live-coding/price-filters",
      },
      {
        id: "metafields",
        title: "Metafields",
        href: "/live-coding/metafields",
      },
      {
        id: "metaobjects",
        title: "Metaobjects",
        href: "/live-coding/metaobjects",
      },
    ],
  },
  {
    id: "liquid",
    title: "Liquid",
    icon: FileCode,
    children: [
      {
        id: "liquid-cheatsheet",
        title: "Liquid Cheatsheet",
        href: "/liquid-cheatsheet",
      },
    ],
  },
  {
    id: "cart-apis",
    title: "Cart APIs",
    icon: ShoppingCart,
    href: "/cart-apis",
  },
  {
    id: "shopify-functions",
    title: "Shopify Functions",
    href: "/shopify-functions",
    icon: Zap,
  },
  {
    id: "post-purchase",
    title: "Post Purchase",
    href: "/post-purchase",
    icon: CreditCard,
  },
  {
    id: "shopify-apps",
    title: "Shopify Apps",
    href: "/shopify-apps",
    icon: Package,
  },
  {
    id: "official-docs",
    title: "Read Official Docs",
    href: "https://shopify.dev",
    icon: ExternalLink,
    isExternal: true,
  },
];
