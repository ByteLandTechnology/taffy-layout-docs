/**
 * Theme hook with type-safe helpers for toggling and persistence.
 * @module hooks/useTheme
 * @description
 * Wraps `next-themes` and exposes a typed API for reading and mutating the
 * current theme while coordinating transition styles and mount safety.
 */
"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import type { ThemeContextValue, AppliedTheme } from "@/types/theme";

export function useTheme(): ThemeContextValue {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Resolved theme narrowed to the supported applied theme values.
   */
  const currentTheme: AppliedTheme = (resolvedTheme as AppliedTheme) || "light";

  /**
   * Toggle between light and dark themes using the resolved theme value.
   */
  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [currentTheme, setTheme]);

  /**
   * Enable a temporary CSS class to smooth the theme transition.
   */
  const enableTransition = useCallback(() => {
    document.documentElement.classList.add("theme-transitioning");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);
  }, []);

  return {
    theme: currentTheme,
    setTheme: (t: AppliedTheme) => {
      enableTransition();
      setTheme(t);
    },
    toggleTheme: () => {
      enableTransition();
      toggleTheme();
    },
    mounted,
  };
}

/**
 * Simplified theme hook that returns only the applied theme.
 * @returns Current applied theme value.
 */
export function useThemeValue(): AppliedTheme {
  const { theme } = useTheme();
  return theme;
}

/**
 * Convenience hook to check whether dark mode is active.
 * @returns True when the applied theme is dark.
 */
export function useIsDark(): boolean {
  const { theme } = useTheme();
  return theme === "dark";
}
