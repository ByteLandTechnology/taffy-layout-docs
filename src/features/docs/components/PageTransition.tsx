"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * Handles page transition animations for the documentation site.
 * Uses framer-motion to animate opacity and vertical position on route changes.
 * Disables animations if reduced motion is preferred or for doc routes if desired.
 *
 * @param props.children - The page content to animate.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const isDocsRoute = pathname ? /\/docs(\/|$)/.test(pathname) : false;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || isDocsRoute) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="relative"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
