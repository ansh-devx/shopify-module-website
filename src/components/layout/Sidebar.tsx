"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { navigationStructure, NavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const roleHierarchy: Record<string, number> = {
  MEMBER: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

function filterByRole(items: NavigationItem[], userRole: string): NavigationItem[] {
  return items.reduce<NavigationItem[]>((acc, item) => {
    if (item.requiredRole && (roleHierarchy[userRole] || 0) < roleHierarchy[item.requiredRole]) {
      return acc;
    }
    const filtered = item.children ? { ...item, children: filterByRole(item.children, userRole) } : item;
    acc.push(filtered);
    return acc;
  }, []);
}

interface SidebarItemProps {
  item: NavigationItem;
  level?: number;
  isOpen: boolean;
  onToggle: (itemId: string) => void;
  onNavigate?: () => void;
}

function SidebarItem({ item, level = 0, isOpen, onToggle, onNavigate }: SidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;

  const hasActiveChild = item.children?.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/"),
  );

  const handleToggle = () => {
    if (hasChildren) {
      onToggle(item.id);
      if (!isOpen && item.children && item.children.length > 0) {
        const firstChild = item.children[0];
        if (firstChild.href) {
          router.push(firstChild.href);
          onNavigate?.();
        }
      }
    }
  };

  const itemContent = (
    <div
      className={cn(
        "flex items-center gap-2 px-8 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
        level === 0 && "text-text-primary",
        level > 0 && "text-text-secondary",
        isActive && "bg-accent/10 text-accent",
        !isActive && hasActiveChild && "text-text-primary",
        !isActive && "hover:bg-surface-2 hover:text-text-primary",
      )}
    >
      {hasChildren && (
        <button
          onClick={handleToggle}
          className="absolute left-6 flex cursor-pointer items-center justify-center"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-text-tertiary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-tertiary" />
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
          <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
            {itemContent}
          </a>
        ) : (
          <Link href={item.href} onClick={onNavigate}>{itemContent}</Link>
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
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
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
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function findParentItemId(pathname: string): string | null {
  for (const item of navigationStructure) {
    if (item.href === pathname) return item.id;
    if (item.children) {
      for (const child of item.children) {
        if (child.href === pathname) return item.id;
      }
    }
  }
  return null;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const userRole = (session?.user as { role?: string } | undefined)?.role || "MEMBER";
  const visibleNavItems = useMemo(() => filterByRole(navigationStructure, userRole), [userRole]);

  useEffect(() => {
    const parentId = findParentItemId(pathname);
    if (parentId) setOpenItemId(parentId);
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = (itemId: string) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  const navContent = (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Learning Path
        </h2>
      </div>
      <nav className="space-y-1">
        {visibleNavItems.map((item) => (
          <div key={item.id}>
            {item.id === "hackathon" && (
              <div className="my-4 px-3">
                <div className="border-t border-accent/10 mb-4"></div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Events
                </h2>
              </div>
            )}
            {item.id === "app-access-token" && (
              <div className="my-4 px-3">
                <div className="border-t border-accent/10 mb-4"></div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Config
                </h2>
              </div>
            )}
            {item.id === "knowledge-hub" && (
              <div className="my-4 px-3">
                <div className="border-t border-accent/10 mb-4"></div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  AI
                </h2>
              </div>
            )}
            {item.id === "claude-analytics" && (
              <div className="my-4 px-3">
                <div className="border-t border-accent/10 mb-4"></div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Analytics
                </h2>
              </div>
            )}
            <SidebarItem
              item={item}
              isOpen={openItemId === item.id}
              onToggle={handleToggle}
              onNavigate={onClose}
            />
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 overflow-y-auto bg-surface-1 border-r border-accent/5">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto bg-surface-1 border-r border-accent/5 lg:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-accent/5">
          <span className="text-sm font-semibold text-text-primary">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
