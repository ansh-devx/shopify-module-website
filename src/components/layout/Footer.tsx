import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  learn: [
    { name: "What is Shopify", href: "/what-is-shopify" },
    { name: "Partners Dashboard", href: "/partners-dashboard" },
    { name: "Store Admin", href: "/store-admin" },
    { name: "CLI Setup", href: "/cli-setup" },
  ],
  resources: [
    { name: "Liquid", href: "/liquid-cheatsheet" },
    { name: "Cart APIs", href: "/cart-apis" },
    { name: "Shopify Functions", href: "/shopify-functions" },
    { name: "Shopify Apps", href: "/shopify-apps" },
  ],
  social: [
    { name: "GitHub", href: "#", icon: Github },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-accent/10 bg-surface-1">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gradient">
              Shopify Learn
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              Your comprehensive guide to mastering Shopify development.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Learn</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Connect</h3>
            <div className="mt-4 flex space-x-4">
              {footerLinks.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-text-secondary hover:text-accent transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-accent/10 pt-8">
          <p className="text-center text-sm text-text-tertiary">
            &copy; {new Date().getFullYear()} Shopify Learn. Built with Next.js
            and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
