/**
 * @module Sidebar
 * @description Sidebar navigation component for documentation pages.
 * Renders a hierarchical navigation tree with collapsible sections and active state highlighting.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, memo, useMemo } from "react";
import type { NavItem } from "@/features/docs/lib/docs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

/**
 * Check if a navigation item is active based on current pathname
 * @param pathname - Current URL pathname
 * @param href - Item href to check
 * @returns Whether the item is active
 */
function isItemActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Check if any child item is active
 * @param pathname - Current URL pathname
 * @param items - Child navigation items
 * @returns Whether any child is active
 */
function hasActiveChild(pathname: string, items?: NavItem[]): boolean {
  if (!items?.length) return false;
  return items.some(
    (child) =>
      isItemActive(pathname, child.href) ||
      hasActiveChild(pathname, child.children),
  );
}

/**
 * Props for individual sidebar node items
 */
interface SidebarNodeProps {
  /** Navigation item data */
  item: NavItem;
  /** Current nesting depth */
  depth: number;
  /** Current pathname for active state detection */
  pathname: string;
}

/**
 * Memoized individual sidebar node component
 * Prevents unnecessary re-renders during state changes
 */
const SidebarNode = memo(function SidebarNode({
  item,
  depth,
  pathname,
}: SidebarNodeProps) {
  const active = useMemo(
    () => isItemActive(pathname, item.href),
    [pathname, item.href],
  );
  const hasChildren = item.children && item.children.length > 0;
  const defaultOpen = useMemo(
    () => hasChildren && (active || hasActiveChild(pathname, item.children)),
    [hasChildren, active, pathname, item.children],
  );
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      const t = setTimeout(() => setOpen(true), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [defaultOpen]);

  if (hasChildren) {
    return (
      <div className="mb-2">
        <div className="flex items-center justify-between py-1 pr-2">
          {item.href ? (
            <Link
              href={item.href}
              className={`flex-1 text-sm font-medium transition-colors ${
                active
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
            >
              {item.title}
            </Link>
          ) : (
            <span
              className="flex-1 cursor-pointer text-sm font-bold text-slate-800 select-none dark:text-slate-200"
              onClick={() => setOpen((value) => !value)}
            >
              {item.title}
            </span>
          )}
          <button
            type="button"
            className="ml-2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-800">
                {item.children?.map((child, idx) => (
                  <SidebarNode
                    key={child.href ?? child.title ?? idx}
                    item={child}
                    depth={depth + 1}
                    pathname={pathname}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="py-1">
      {item.href ? (
        <Link
          href={item.href}
          className={`block text-sm transition-colors duration-200 ${
            active
              ? "-ml-4 border-l-2 border-blue-600 pl-3.5 font-medium text-blue-600"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          }`}
        >
          {item.title}
        </Link>
      ) : (
        <div className="py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-500">
          {item.title}
        </div>
      )}
    </div>
  );
});

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  /** Array of navigation items to render */
  items: NavItem[];
}

/**
 * Sidebar navigation component
 * @param props - Component properties
 * @returns Hierarchical navigation sidebar
 */
export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname() || "/";

  return (
    <nav className="w-full">
      {items.map((item, idx) => (
        <SidebarNode
          key={item.href ?? item.title ?? idx}
          item={item}
          depth={0}
          pathname={pathname}
        />
      ))}
    </nav>
  );
}
