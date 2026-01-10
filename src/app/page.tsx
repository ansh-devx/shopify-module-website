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
  Github,
  Code,
  ShoppingCart,
  Zap,
  Package,
  Smartphone,
} from "lucide-react";

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
    title: "GitHub Configuration",
    description:
      "Version control your Shopify theme using GitHub and best practices.",
    icon: Github,
    href: "/github-config",
    badge: "Development",
  },
  {
    title: "Liquid Cheatsheet",
    description:
      "Master Shopify's templating language with our comprehensive Liquid reference.",
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
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Badge variant="success" className="mb-6 text-base">
            Free Learning Platform
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Master{" "}
            <span className="text-shopify-green">Shopify Development</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Your comprehensive guide to building powerful e-commerce
            experiences.
            <br />
            From basics to advanced concepts, all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/what-is-shopify">Start Learning</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/liquid-cheatsheet">View Cheatsheet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-shopify-green">10+</div>
            <div className="mt-2 text-sm text-gray-600">Learning Modules</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-shopify-green">100%</div>
            <div className="mt-2 text-sm text-gray-600">Free Content</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-shopify-green">∞</div>
            <div className="mt-2 text-sm text-gray-600">Possibilities</div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Learning Paths
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose your path and start building amazing Shopify experiences
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

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <Card className="bg-gradient-to-r from-shopify-green to-shopify-teal text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join thousands of developers learning Shopify development
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/what-is-shopify">Get Started Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
