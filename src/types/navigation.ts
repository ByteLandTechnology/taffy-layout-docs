/**
 * Navigation type definitions for the documentation UI.
 * @module types/navigation
 * @description
 * Shared navigation interfaces used by header, sidebar, and mobile navigation
 * components to describe grouped links and rendering inputs.
 */

import { type Locale, type UiStrings } from "@/lib/locales";
import { type NavItem } from "@/features/docs/lib/docs";
import { type LucideIcon } from "lucide-react";

/**
 * Represents a group of navigation links in the UI.
 */
export interface NavGroup {
  /** Stable key used for lookup and active state matching. */
  key: string;
  /** Human-readable title shown in navigation menus. */
  title: string;
  /** Base href for the group landing page. */
  href: string;
  /** Optional icon displayed alongside the group title. */
  icon?: LucideIcon;
}

/**
 * Base props required for navigation components that depend on locale and UI strings.
 */
export interface NavigationProps {
  /** Current locale for localized labels and routes. */
  locale: Locale;
  /** Optional localized UI strings for navigation labels. */
  ui?: UiStrings;
  /** Optional navigation items for the active section. */
  navItems?: NavItem[];
}

/**
 * Extended navigation props including the navigation data (groups and active state).
 */
export interface NavigationDataProps extends NavigationProps {
  /** Ordered list of navigation groups shown in menus. */
  navGroups: NavGroup[];
  /** Key of the currently active group, if any. */
  activeGroup?: string;
  /** Optional class name used to extend container styling. */
  className?: string;
}
