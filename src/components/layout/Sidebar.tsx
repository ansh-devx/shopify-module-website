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
  const Icon = item.icon;

  // Check if any child is active
  const hasActiveChild = item.children?.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  );

  const handleToggle = () => {
    if (hasChildren) {
      // Toggle the accordion state
      onToggle(item.id);

      // If we're opening this section (it was closed), navigate to first child
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
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        level === 0 && "text-white",
        level > 0 && "text-white/80",
        isActive && "bg-green-900 text-shopify-green",
        !isActive && hasActiveChild && "text-white",
        !isActive && !hasActiveChild && "hover:bg-green-950"
      )}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
    >
      {hasChildren && (
        <button
          onClick={handleToggle}
          className="flex items-center justify-center"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
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

      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
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
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-green-900 bg-black">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-white/60">
            Learning Path
          </h2>
        </div>
        <nav className="space-y-1">
          {navigationStructure.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isOpen={openItemId === item.id}
              onToggle={handleToggle}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
