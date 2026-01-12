"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navigationStructure, NavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  item: NavigationItem;
  level?: number;
  isOpen: boolean;
  onToggle: (itemId: string) => void;
}

function SidebarItem({ item, level = 0, isOpen, onToggle }: SidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;

  // Check if any child is active
  const hasActiveChild = item.children?.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  );

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(item.id);

      if (!isOpen && item.children && item.children.length > 0) {
        const firstChild = item.children[0];
        if (firstChild.href) {
          router.push(firstChild.href);
        }
      }
    }
  };

  const itemContent = (
    <div
      className={cn(
        "flex items-center gap-2 px-8 py-2 text-sm font-medium transition-colors rounded-md hover:bg-[#2e3739]",
        level === 0 && "text-white",
        level > 0 && "text-white/80",
        isActive && "bg-[#2e3739] text-white",
        !isActive && hasActiveChild && "text-white"
      )}
    >
      {hasChildren && (
        <button
          onClick={handleToggle}
          className="absolute left-6 flex cursor-pointer items-center justify-center"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
      <span className="flex-1">{item.title}</span>
    </div>
  );

  return (
    <div>
      {item.href && !hasChildren ? (
        item.isExternal ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {itemContent}
          </a>
        ) : (
          <Link href={item.href}>{itemContent}</Link>
        )
      ) : (
        <div className="cursor-pointer" onClick={handleToggle}>
          {itemContent}
        </div>
      )}

      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="mt-1 space-y-1 ml-8">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                level={level + 1}
                isOpen={false}
                onToggle={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Find which top-level navigation item contains the given path
 */
function findParentItemId(pathname: string): string | null {
  for (const item of navigationStructure) {
    // Check if this item or any of its children match the current path
    if (item.href === pathname) {
      return item.id;
    }

    if (item.children) {
      for (const child of item.children) {
        if (child.href === pathname) {
          return item.id;
        }
      }
    }
  }
  return null;
}

export default function Sidebar() {
  const pathname = usePathname();

  // Track which top-level item is currently open (accordion behavior)
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // Auto-expand the section containing the current page
  useEffect(() => {
    const parentId = findParentItemId(pathname);
    if (parentId) {
      setOpenItemId(parentId);
    }
  }, [pathname]);

  const handleToggle = (itemId: string) => {
    // If clicking the currently open item, close it
    // Otherwise, open the clicked item and close others (accordion)
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 overflow-y-auto bg-[#151d1e]">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-white/60">
            Learning Path
          </h2>
        </div>
        <nav className="space-y-1">
          {navigationStructure.map((item, index) => (
            <div key={item.id}>
              {item.id === "hackathon" && (
                <div className="my-4 px-3">
                  <div className="border-t border-white/20 mb-4"></div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    Events
                  </h2>
                </div>
              )}
              <SidebarItem
                item={item}
                isOpen={openItemId === item.id}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
