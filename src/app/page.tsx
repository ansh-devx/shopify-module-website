import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export default async function Home() {
  // Verify session on server side
  const session = await getServerSession(authOptions);

  console.log(
    "Homepage - Session:",
    session ? "Authenticated" : "Not authenticated",
  );

  return (
    <div className="bg-[#0d1213]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Welcome to{" "}
            <span className="text-shopify-green">Shopify Development</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Your internal onboarding guide to get up to speed with Shopify.
            <br />
            Learn by building a complete Product Details Page from Figma.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/task">View Task</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/what-is-shopify">Learn Basics First</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Learning Topics
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore topics at your own pace, from basics to advanced concepts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => {
            const Icon = path.icon;
            return (
              <Link key={path.title} href={path.href}>
                <Card
                  hover
                  className="h-full transition-all hover:border-shopify-green"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-lg bg-shopify-green/10 p-3">
                        <Icon className="h-6 w-6 text-shopify-green" />
                      </div>
                      <Badge variant="info">{path.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <Card className="bg-gradient-to-r from-shopify-green to-shopify-teal text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Start Your task?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Build a complete PDP from Figma. Learn Shopify concepts naturally
              as you work through each step.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/task">View task Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
