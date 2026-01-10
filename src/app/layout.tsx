import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
