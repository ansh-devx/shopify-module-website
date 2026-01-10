"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navigation = [
  { name: "What is Shopify", href: "/what-is-shopify" },
  { name: "Partners Dashboard", href: "/partners-dashboard" },
  { name: "Store Admin", href: "/store-admin" },
  { name: "CLI Setup", href: "/cli-setup" },
  { name: "GitHub Config", href: "/github-config" },
  { name: "Liquid Cheatsheet", href: "/liquid-cheatsheet" },
  { name: "Cart APIs", href: "/cart-apis" },
  { name: "Shopify Functions", href: "/shopify-functions" },
  { name: "Post Purchase", href: "/post-purchase" },
  { name: "Shopify Apps", href: "/shopify-apps" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-shopify-green">
              Shopify Learn
            </span>
          </Link>
        </div>

        {/* Hamburger menu button with dropdown */}
        <div className="relative flex" ref={menuRef}>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Dropdown menu */}
          {mobileMenuOpen && (
            <div
              className="absolute right-0 top-12 w-64 origin-top-right rounded-lg shadow-xl focus:outline-none"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #374151",
              }}
            >
              <div className="py-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-shopify-green"
                    style={{ color: "#ffffff" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
