"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop component that scrolls the window to the top (position 0)
 * whenever the route changes in Next.js
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to the very top of the page (position 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

