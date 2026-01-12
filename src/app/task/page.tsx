import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import {
  FileText,
  Layout,
  Image,
  ShoppingCart,
  Tag,
  CreditCard,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "task: Build a Product Details Page - Shopify Learn",
  description:
    "Your task: Build a complete PDP from Figma using Shopify themes, sections, templates, and more.",
};

const taskSteps = [
  {
    id: "setup",
    title: "Setup & Basics",
    description:
      "Get your development environment ready and understand the basics",
    icon: FileText,
    topics: [
      {
        title: "Partners Dashboard",
        href: "/partners-dashboard",
        description: "Access your development store",
      },
      {
        title: "Store Admin",
        href: "/store-admin",
        description: "Navigate the Shopify admin",
      },
      {
        title: "Theme Setup",
        href: "/live-coding/setup",
        description: "Clone skeleton theme and set up CLI",
      },
    ],
  },
  {
    id: "templates",
    title: "Create Product Template",
    description: "Create and assign a product template for your PDP",
    icon: Layout,
    topics: [
      {
        title: "Templates",
        href: "/live-coding/templates",
        description: "Understand template formats and task",
      },
      {
        title: "Product Object",
        href: "/live-coding/product-object",
        description: "Learn about product properties and variants",
      },
    ],
  },
  {
    id: "sections",
    title: "Build Sections",
    description: "Create sections according to Figma design with schema",
    icon: Layout,
    topics: [
      {
        title: "Sections & Schema",
        href: "/live-coding/sections",
        description: "Create customizable sections",
      },
      {
        title: "Theme Editor",
        href: "/task/theme-editor",
        description: "Navigate and use the theme editor",
      },
      {
        title: "Images & Assets",
        href: "/task/images-assets",
        description: "Upload and use images in sections",
      },
    ],
  },
  {
    id: "header",
    title: "Build Header & Navigation",
    description: "Create header according to Figma with menu integration",
    icon: Layout,
    topics: [
      {
        title: "Header & Navigation",
        href: "/task/header-navigation",
        description: "Build header and integrate menus",
      },
    ],
  },
  {
    id: "metafields",
    title: "Add Metafields & Metaobjects",
    description: "Use metafields and metaobjects for custom content",
    icon: FileText,
    topics: [
      {
        title: "Metafields",
        href: "/live-coding/metafields",
        description: "Add custom product data",
      },
      {
        title: "Metaobjects",
        href: "/live-coding/metaobjects",
        description: "Create reusable content structures",
      },
    ],
  },
  {
    id: "cart",
    title: "Cart Functionality",
    description: "Implement add to cart with cart drawer and AJAX updates",
    icon: ShoppingCart,
    topics: [
      {
        title: "Cart APIs",
        href: "/cart-apis",
        description: "Learn Cart APIs and Section Rendering",
      },
      {
        title: "Liquid",
        href: "/liquid-cheatsheet",
        description: "Reference for Liquid syntax",
      },
    ],
  },
  {
    id: "discounts",
    title: "Create Discount",
    description: "Build discount: 20% off on buying 2+ quantity of X product",
    icon: Tag,
    topics: [
      {
        title: "Discounts",
        href: "/task/discounts",
        description: "Learn discount types and create your discount",
      },
    ],
  },
  {
    id: "checkout",
    title: "Test Checkout",
    description: "Complete purchase flow and test checkout",
    icon: CreditCard,
    topics: [],
  },
  {
    id: "flow",
    title: "Shopify Flow Automation",
    description:
      "Set up post-purchase automation to cancel orders for @devxlabs.ai emails",
    icon: CreditCard,
    topics: [
      {
        title: "Shopify Flow",
        href: "/post-purchase",
        description: "Learn and implement order cancellation flow",
      },
    ],
  },
  {
    id: "functions",
    title: "Pack Pricing Challenge (Advanced)",
    description:
      "Implement Pack of 1 and 2 discount logic using Shopify Functions",
    icon: Zap,
    topics: [
      {
        title: "Shopify Functions",
        href: "/shopify-functions",
        description: "Solve the pack pricing challenge",
      },
    ],
  },
];

export default function TaskPage() {
  return (
    <ContentLayout
      title="Your task: Build a Product Details Page"
      description="Learn Shopify by building a complete PDP from Figma. Each step links to the concepts you need to master."
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <div className="rounded-lg border border-[#24393d] bg-[#151d1e] p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Task Overview
            </h2>
            <p className="text-lg text-white/80 mb-4">
              Build a complete Product Details Page (PDP) from a Figma design
              using Shopify themes. This project-based approach will help you
              learn Shopify concepts naturally as you work through each step.
            </p>
            <div className="mt-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-shopify-green hover:text-shopify-green/80 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                View Figma Design
              </a>
            </div>
          </div>
        </section>

        {/* Task Goal */}
        <section>
          <h2 className="text-3xl font-bold text-white">
            What You&apos;ll Build
          </h2>
          <p className="mt-4 text-lg text-white/80">Your PDP will include:</p>
          <ul className="mt-4 space-y-2 text-white/80 list-disc list-inside">
            <li>Product images, title, description, and pricing</li>
            <li>Custom content using metafields and metaobjects</li>
            <li>Header and navigation menu matching the Figma design</li>
            <li>Add to cart functionality with AJAX cart drawer</li>
            <li>Cart drawer with increment, decrement, and remove</li>
            <li>Discount coupon (20% off on 2+ quantity)</li>
            <li>Post-purchase automation using Shopify Flow</li>
            <li>
              <strong>Advanced Challenge:</strong> Pack pricing using Shopify
              Functions
            </li>
          </ul>
        </section>

        {/* Step-by-Step Breakdown */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">
            Step-by-Step Guide
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Follow these steps in order. Each step links to the learning
            materials you need.
          </p>

          <div className="space-y-6">
            {taskSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className="border-[#24393d] bg-[#151d1e]">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-shopify-green text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-6 w-6 text-shopify-green" />
                          <CardTitle className="text-2xl text-white">
                            {step.title}
                          </CardTitle>
                        </div>
                        <p className="text-white/80 mt-2">{step.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  {step.topics.length > 0 && (
                    <CardContent>
                      <div className="mt-4 pt-4 border-t border-[#24393d]">
                        <h4 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wide">
                          Learn These Topics
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {step.topics.map((topic) => (
                            <Link
                              key={topic.href}
                              href={topic.href}
                              className="flex items-start gap-3 p-3 rounded-lg border border-[#24393d] bg-[#151d1e] hover:border-shopify-green/50 hover:bg-[#151d1e]/70 transition-colors group"
                            >
                              <ArrowRight className="h-4 w-4 text-shopify-green shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white group-hover:text-shopify-green transition-colors">
                                  {topic.title}
                                </div>
                                <div className="text-sm text-white/60 mt-1">
                                  {topic.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* Getting Started CTA */}
        <section>
          <Card className="bg-gradient-to-r from-shopify-green/20 to-shopify-teal/20 border-shopify-green/50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Start?
              </h2>
              <p className="text-white/80 mb-6">
                Begin with Step 1: Setup & Basics. Make sure you have access to
                a development store and the Figma design file.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/partners-dashboard">
                    Start with Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/what-is-shopify">Review Basics First</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ContentLayout>
  );
}
