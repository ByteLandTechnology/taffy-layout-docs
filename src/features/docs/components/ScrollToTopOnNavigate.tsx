"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { animateScroll, scroller } from "react-scroll";

/**
 * @module features/docs/components/ScrollToTopOnNavigate
 * @description A utility component that handles scroll behavior on navigation.
 * - Scrolls to top on pathname changes.
 * - Scrolls to hash locations if present in the URL.
 * - Handles smooth scrolling for hash links.
 *
 * This component does not render any visual UI.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      const offset = 110;
      scroller.scrollTo(id, {
        duration: 600,
        smooth: "easeInOutQuad",
        offset: -offset,
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (typeof window !== "undefined" && window.location.hash) return;
    window.requestAnimationFrame(() => {
      animateScroll.scrollToTop({ duration: 600, smooth: "easeInOutQuad" });
    });
  }, [pathname]);

  return null;
}
