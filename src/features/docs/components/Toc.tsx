/**
 * @module Toc
 * @description Table of Contents component for documentation pages.
 * Displays a scrollable list of page headings with active section highlighting and smooth scroll navigation.
 */

"use client";

import type { TocItem } from "@/features/docs/lib/docs";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useState, memo } from "react";
import { scroller } from "react-scroll";

/**
 * Props for the Toc component
 */
interface TocProps {
  /** Array of table of contents items */
  items: TocItem[];
  /** Title displayed above the TOC list */
  title: string;
}

/**
 * Table of Contents component with intersection observer for active section highlighting
 * @param props - Component properties
 * @returns Table of contents navigation with smooth scrolling
 */
const Toc = memo(function Toc({ items, title }: TocProps) {
  /* Hooks must be called before early return */
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 110;
    scroller.scrollTo(id, {
      duration: 600,
      smooth: "easeInOutQuad",
      offset: -offset,
    });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const hash = event.currentTarget.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        scrollToHeading(id);
      }
    },
    [scrollToHeading],
  );

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        {title}
      </p>
      <nav className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleClick}
            className={`block rounded-md px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 ${
              item.level === 3 ? "ml-3" : ""
            } ${
              activeId === item.id
                ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                : item.level === 3
                  ? "text-slate-500 dark:text-slate-500"
                  : ""
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
});

export default Toc;
