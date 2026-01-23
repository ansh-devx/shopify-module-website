import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Shopify Learn",
  description: "Sign in to Shopify Learn",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just pass through children - root layout handles html/body tags
  return <>{children}</>;
}
