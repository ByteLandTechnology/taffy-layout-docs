/**
 * Theme system type definitions.
 * @module types/theme
 * @description
 * Centralizes theme-related types used by the theme provider, toggle components,
 * and UI state management across the documentation site.
 */

/**
 * Supported theme modes set by the user.
 * @description
 * The `system` value indicates that the active theme should follow the operating
 * system preference.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Applied theme value after resolving `system` preference.
 */
export type AppliedTheme = "light" | "dark";

/**
 * Theme configuration options used by the provider.
 */
export interface ThemeConfig {
  /** Default applied theme when no preference is stored. */
  defaultTheme: AppliedTheme;
  /** Whether to follow the system color scheme preference. */
  followSystem: boolean;
  /** localStorage key used to persist the user's selection. */
  storageKey: string;
}

/**
 * Theme context value exposed to UI components.
 */
export interface ThemeContextValue {
  /** Current applied theme used for rendering. */
  theme: AppliedTheme;
  /** Set the applied theme directly. */
  setTheme: (theme: AppliedTheme) => void;
  /** Toggle between light and dark themes. */
  toggleTheme: () => void;
  /** Whether the provider has mounted to avoid hydration mismatch. */
  mounted: boolean;
}

/**
 * Theme toggle button props for UI components.
 */
export interface ThemeToggleProps {
  /** Tooltip label text (supports i18n). */
  label?: string;
  /** Tooltip text shown when switching to light mode. */
  tooltipLight?: string;
  /** Tooltip text shown when switching to dark mode. */
  tooltipDark?: string;
  /** Screen-reader label for light mode. */
  labelLight?: string;
  /** Screen-reader label for dark mode. */
  labelDark?: string;
  /** Button variant, mapped to the design system. */
  variant?: "light" | "bordered" | "flat" | "solid";
  /** Button size. */
  size?: "sm" | "md" | "lg";
  /** Custom class name for additional styling. */
  className?: string;
}
