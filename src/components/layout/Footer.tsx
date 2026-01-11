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
    { name: "Liquid Cheatsheet", href: "/liquid-cheatsheet" },
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
    <footer className="border-t border-green-900 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-shopify-green">
              Shopify Academy
            </Link>
            <p className="mt-4 text-sm text-white/70">
              Your comprehensive guide to mastering Shopify development.
            </p>
          </div>

          {/* Learn Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Learn</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-shopify-green"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-shopify-green"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <div className="mt-4 flex space-x-4">
              {footerLinks.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white/70 hover:text-shopify-green"
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

        {/* Bottom */}
        <div className="mt-8 border-t border-green-900 pt-8">
          <p className="text-center text-sm text-white/70">
            &copy; {new Date().getFullYear()} Shopify Academy. Built with
            Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
