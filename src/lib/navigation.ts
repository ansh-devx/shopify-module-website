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
  Target,
  Image as ImageIcon,
  Tag,
  Menu,
  Trophy,
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
    id: "task",
    title: "Task",
    href: "/task",
    icon: Target,
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
    id: "building-pdp",
    title: "Building Your PDP",
    icon: Layout,
    children: [
      {
        id: "theme-setup",
        title: "Theme Setup",
        href: "/live-coding/setup",
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
        id: "theme-editor",
        title: "Theme Editor",
        href: "/task/theme-editor",
      },
      {
        id: "images-assets",
        title: "Images & Assets",
        href: "/task/images-assets",
      },
      {
        id: "header-navigation",
        title: "Header & Navigation",
        href: "/task/header-navigation",
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
    id: "advanced-features",
    title: "Advanced Features",
    icon: ShoppingCart,
    children: [
      {
        id: "cart-apis",
        title: "Cart APIs",
        href: "/cart-apis",
      },
      {
        id: "discounts",
        title: "Discounts",
        href: "/task/discounts",
      },
    ],
  },
  {
    id: "automation",
    title: "Automation",
    icon: CreditCard,
    children: [
      {
        id: "shopify-flow",
        title: "Shopify Flow",
        href: "/post-purchase",
      },
    ],
  },
  {
    id: "advanced-challenge",
    title: "Advanced Challenge",
    icon: Zap,
    children: [
      {
        id: "shopify-functions",
        title: "Shopify Functions",
        href: "/shopify-functions",
      },
    ],
  },
  {
    id: "reference",
    title: "Reference",
    icon: FileCode,
    children: [
      {
        id: "liquid",
        title: "Liquid",
        href: "/liquid-cheatsheet",
      },
      {
        id: "official-docs",
        title: "Official Docs",
        href: "https://shopify.dev",
        isExternal: true,
      },
    ],
  },
  {
    id: "hackathon",
    title: "Hackathon",
    href: "/hackathon",
    icon: Trophy,
  },
];
