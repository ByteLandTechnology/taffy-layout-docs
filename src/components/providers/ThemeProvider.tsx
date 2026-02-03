"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

/**
 * Props for the theme provider wrapper.
 */
interface ThemeProviderProps {
  /** Provider children. */
  children: ReactNode;
  /** Default theme mode used when no preference is stored. */
  defaultTheme?: "light" | "dark" | "system";
  /** Whether to follow the system color scheme. */
  enableSystem?: boolean;
  /** Disable CSS transitions during theme changes. */
  disableTransitionOnChange?: boolean;
  /** Storage key for the theme preference. */
  storageKey?: string;
}

/**
 * Theme provider wrapper with application defaults.
 * @module components/providers/ThemeProvider
 * @param props - Theme provider configuration options.
 * @returns Theme provider JSX.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey="taffy-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
