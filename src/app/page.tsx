"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import MagneticButton from "@/components/ui/MagneticButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import {
  ShoppingBag,
  Users,
  Settings,
  Terminal,
  Code,
  ShoppingCart,
  Zap,
  Package,
  Smartphone,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";
import Loader from "@/components/ui/Loader";

const learningPaths = [
  {
    title: "What is Shopify",
    description:
      "Discover Shopify's platform, its global growth, and why it's the leading e-commerce solution.",
    icon: ShoppingBag,
    href: "/what-is-shopify",
    badge: "Fundamentals",
  },
  {
    title: "Partners Dashboard",
    description:
      "Learn how to navigate the Partners Dashboard and accept store organization invitations.",
    icon: Users,
    href: "/partners-dashboard",
    badge: "Getting Started",
  },
  {
    title: "Store Admin Overview",
    description:
      "Comprehensive guide to the Shopify admin panel and its powerful features.",
    icon: Settings,
    href: "/store-admin",
    badge: "Essential",
  },
  {
    title: "Shopify CLI + Tailwind",
    description:
      "Set up your development environment with Shopify CLI and integrate Tailwind CSS.",
    icon: Terminal,
    href: "/cli-setup",
    badge: "Development",
  },
  {
    title: "Liquid",
    description:
      "Learn the basics of Liquid, Shopify's templating language for building themes.",
    icon: Code,
    href: "/liquid-cheatsheet",
    badge: "Reference",
  },
  {
    title: "Cart & Section APIs",
    description:
      "Build dynamic shopping experiences with Cart APIs and Section Rendering.",
    icon: ShoppingCart,
    href: "/cart-apis",
    badge: "Advanced",
  },
  {
    title: "Shopify Functions",
    description:
      "Extend Shopify's backend with custom business logic using Functions.",
    icon: Zap,
    href: "/shopify-functions",
    badge: "Advanced",
  },
  {
    title: "Post Purchase Flow",
    description:
      "Understand order processing, Shopify Flow, and post-purchase automation.",
    icon: Package,
    href: "/post-purchase",
    badge: "Advanced",
  },
  {
    title: "Shopify Apps",
    description: "Learn how to build, deploy, and monetize Shopify apps.",
    icon: Smartphone,
    href: "/shopify-apps",
    badge: "Advanced",
  },
];

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  if (!session?.user) {
    return (
      <>
        <div className="pointer-events-none">
          <HomeContent />
        </div>
        <AuthModal fullScreen={true} />
      </>
    );
  }

  return <HomeContent />;
}

function HomeContent() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/[0.06] blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-accent-warm/[0.04] blur-[100px] animate-float" />
        </div>

        <div className="text-center">
          <ScrollReveal>
            <h1 className="font-serif text-5xl tracking-tight sm:text-7xl lg:text-8xl leading-[1.05]">
              Welcome to{" "}
              <span className="text-gradient-shimmer">
                Shopify Development
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-6 text-lg leading-8 text-text-secondary sm:text-xl max-w-2xl mx-auto">
              Your internal onboarding guide to get up to speed with Shopify.
              <br />
              Learn by building a complete Product Details Page from Figma.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <MagneticButton variant="primary" as="a" href="/task">
                View Task
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                as="a"
                href="/what-is-shopify"
              >
                Learn Basics First
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl tracking-tight text-text-primary sm:text-4xl">
              Learning <span className="text-gradient italic">Topics</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Explore topics at your own pace, from basics to advanced concepts
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => {
            const Icon = path.icon;
            return (
              <StaggerItem key={path.title}>
                <Link href={path.href}>
                  <Card hover className="h-full group">
                    <CardHeader>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-accent/10 p-3 transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(141,213,214,0.1)]">
                          <Icon className="h-6 w-6 text-accent" />
                        </div>
                        <Badge variant="info">{path.badge}</Badge>
                      </div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <ScrollReveal>
          <Card className="relative overflow-hidden border-accent/20">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent-warm/10" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <CardContent className="relative p-12 text-center">
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
                Ready to Start Your{" "}
                <span className="text-gradient italic">Task?</span>
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                Build a complete PDP from Figma. Learn Shopify concepts naturally
                as you work through each step.
              </p>
              <div className="mt-8">
                <MagneticButton variant="primary" as="a" href="/task">
                  View Task Details
                </MagneticButton>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </div>
  );
}
