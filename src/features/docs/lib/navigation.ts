/**
 * @module features/docs/lib/navigation
 * @description Navigation utilities for documentation sidebar and routing.
 * Provides functions for remapping navigation items between locales and building
 * navigation groups for the documentation site.
 */

import type { NavItem } from "@/features/docs/lib/docs";
import {
  DEFAULT_LOCALE,
  localeBasePath,
  type Locale,
  type UiStrings,
} from "@/lib/locales";

/**
 * Remap href URL for a specific locale
 * @param {Locale} locale - Target locale
 * @param {string} [href] - Original href URL
 * @returns {string | undefined} Remapped href or undefined
 * @example
 * const href = remapHref('zh', '/docs/getting-started'); // '/zh/docs/getting-started'
 */
export function remapHref(locale: Locale, href?: string): string | undefined {
  if (!href) return href;
  if (locale === DEFAULT_LOCALE) return href;
  if (href.startsWith("/docs")) {
    return `${localeBasePath(locale)}${href}`;
  }
  return href;
}

/**
 * Recursively remap navigation item and its children for a specific locale
 * @param {Locale} locale - Target locale
 * @param {NavItem} item - Navigation item to remap
 * @returns {NavItem} Remapped navigation item with updated hrefs
 * @example
 * const remapped = remapNavItem('zh', { title: 'Docs', href: '/docs', order: 1 });
 */
export function remapNavItem(locale: Locale, item: NavItem): NavItem {
  return {
    ...item,
    href: remapHref(locale, item.href),
    children: item.children?.map((child) => remapNavItem(locale, child)),
  };
}

/**
 * Navigation data structure for documentation site
 * @interface NavigationData
 * @property {NavItem[]} groups - All navigation groups
 * @property {NavItem} activeGroup - Currently active navigation group
 * @property {Array<{key: string, title: string, href: string}>} navGroups - Simplified nav group data
 * @property {NavItem[]} sidebarItems - Items to display in sidebar
 */
export interface NavigationData {
  groups: NavItem[];
  activeGroup: NavItem;
  navGroups: { key: string; title: string; href: string }[];
  sidebarItems: NavItem[];
}

/**
 * Build navigation groups for the documentation site
 * @param {Locale} locale - Current locale
 * @param {NavItem[]} items - Navigation items for current locale
 * @param {NavItem[]} defaultItems - Default navigation items (fallback)
 * @param {UiStrings} ui - UI strings for navigation labels
 * @param {string[]} [slug] - Current URL slug segments
 * @returns {NavigationData} Complete navigation data structure
 * @example
 * const navData = buildNavigationGroups('en', items, defaultItems, ui, ['getting-started']);
 */
export function buildNavigationGroups(
  locale: Locale,
  items: NavItem[],
  defaultItems: NavItem[],
  ui: UiStrings,
  slug: string[] = [],
): NavigationData {
  const apiSource = defaultItems.find((item) => item.segment === "api");
  // If apiSource is found, we need to ensure it's remapped for the current locale
  const apiGroup = apiSource
    ? { ...remapNavItem(locale, apiSource), title: ui.api }
    : undefined;

  const documentationChildren = items.filter(
    (item) => item.segment && item.segment !== "api",
  );
  const documentationGroup: NavItem = {
    title: ui.docs,
    segment: "docs",
    order: 0,
    href: `${localeBasePath(locale)}/docs`,
    children: documentationChildren,
  };

  const groups = [
    documentationGroup,
    ...(apiGroup ? [apiGroup] : []),
    {
      title: ui.benchmark,
      segment: "benchmark",
      order: 10,
      href: `${localeBasePath(locale)}/benchmark`,
      children: [], // Ensure children exists for type safety if needed, though optional in NavItem
    },
    {
      title: ui.playground,
      segment: "playground",
      order: 11,
      href: `${localeBasePath(locale)}/playground`,
      children: [],
    },
  ];

  const activeGroupKey = slug[0] === "api" ? "api" : "docs";

  const activeGroup =
    groups.find((group) => group.segment === activeGroupKey) ||
    documentationGroup;

  const navGroups = groups.map((group) => ({
    key: group.segment as string,
    title: group.title,
    href: group.href || group.children?.[0]?.href || "#",
  }));

  const sidebarItems = activeGroup ? [activeGroup] : groups;

  return { groups, activeGroup, navGroups, sidebarItems };
}
