import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ScrollToTop from "@/components/ScrollToTop";
import SearchProvider from "@/components/search/SearchProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopify Learn - Master Shopify Development",
  description:
    "Your comprehensive guide to mastering Shopify development. Learn about Shopify CLI, Liquid, APIs, Functions, and more.",
  keywords: [
    "Shopify",
    "Shopify Development",
    "Liquid",
    "Shopify CLI",
    "Shopify Apps",
    "E-commerce",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="ml-64 flex-1 bg-black text-white">
                {children}
              </main>
            </div>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
