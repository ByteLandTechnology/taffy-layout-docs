/**
 * @module MobileMenu
 * @description Mobile navigation menu component for documentation pages.
 * Provides a collapsible sidebar navigation for mobile devices with reduced motion support.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import type { NavItem } from "@/features/docs/lib/docs";
import type { UiStrings } from "@/lib/locales";
import { ChevronDown } from "lucide-react";

/**
 * Custom hook to detect user's reduced motion preference
 * @returns Whether the user prefers reduced motion
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Initialize with media query value to avoid synchronous setState in effect
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Props for the MobileMenu component
 */
interface MobileMenuProps {
  /** Navigation items to display in the mobile menu */
  items: NavItem[];
  /** UI strings for localization */
  ui: UiStrings;
}

/**
 * Mobile navigation menu component with collapsible sidebar
 * @param props - Component properties
 * @returns Mobile menu button and expandable navigation panel
 */
export default function MobileMenu({ items, ui }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="animate-fade-up mb-6 lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-content"
      >
        <span>{ui.browseDocs}</span>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""} dark:text-slate-500`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu-content"
            initial={
              prefersReducedMotion
                ? { height: "auto", opacity: 1, marginTop: 16 }
                : { height: 0, opacity: 0, marginTop: 0 }
            }
            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
            exit={
              prefersReducedMotion
                ? { height: "auto", opacity: 1, marginTop: 16 }
                : { height: 0, opacity: 0, marginTop: 0 }
            }
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
            }
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="p-4">
              <Sidebar items={items} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
