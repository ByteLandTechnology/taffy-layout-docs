/**
 * Site header type definitions.
 * @module components/layouts/SiteHeader/types
 * @description
 * Provides strongly typed props for header layout components and shared
 * navigation structures used by desktop and mobile header variants.
 */

import type { Locale, UiStrings } from "@/lib/locales";

/**
 * Simple navigation group definition for the site header.
 */
export interface NavGroup {
  /** Stable key used for matching active group state. */
  key: string;
  /** Display title rendered in the header. */
  title: string;
  /** Base href for the group landing page. */
  href: string;
}

/**
 * Props shared by the top-level site header component.
 */
export interface SiteHeaderProps {
  /** Optional locale for localized labels and routing. */
  locale?: Locale;
  /** Optional navigation groups rendered in the header. */
  navGroups?: NavGroup[];
  /** Optional key of the currently active group. */
  activeGroup?: string;
  /** Optional UI strings for localization. */
  ui?: UiStrings;
}

/**
 * Props for the desktop header layout.
 */
export interface DesktopHeaderProps {
  /** Active locale for rendering localized routes and labels. */
  locale: Locale;
  /** Navigation groups displayed in the header. */
  navGroups: NavGroup[];
  /** Optional key of the active navigation group. */
  activeGroup?: string;
  /** Localized UI strings for header labels. */
  ui: UiStrings;
  /** Base path for locale-aware routing. */
  basePath: string;
}

/**
 * Props for the mobile header layout.
 */
export interface MobileHeaderProps {
  /** Active locale for rendering localized routes and labels. */
  locale: Locale;
  /** Navigation groups displayed in the mobile menu. */
  navGroups: NavGroup[];
  /** Optional key of the active navigation group. */
  activeGroup?: string;
  /** Localized UI strings for header labels. */
  ui: UiStrings;
  /** Base path for locale-aware routing. */
  basePath: string;
}

/**
 * Props for the header logo component.
 */
export interface LogoProps {
  /** Active locale for the logo link destination. */
  locale: Locale;
  /** Base path for locale-aware routing. */
  basePath: string;
}

/**
 * Props for the mobile menu overlay.
 */
export interface MobileMenuProps {
  /** Navigation groups shown in the menu. */
  navGroups: NavGroup[];
  /** Optional key of the active navigation group. */
  activeGroup?: string;
  /** Localized UI strings for navigation labels. */
  ui: UiStrings;
  /** Ref to the first focusable menu link for focus management. */
  firstLinkRef: React.RefObject<HTMLAnchorElement | null>;
  /** Close handler invoked when the menu should be dismissed. */
  onClose: () => void;
}

/**
 * Props for the mobile menu toggle button.
 */
export interface MenuButtonProps {
  /** Whether the menu is currently open. */
  isOpen: boolean;
  /** Click handler to toggle the menu state. */
  onClick: () => void;
  /** Accessible label for screen readers. */
  ariaLabel: string;
}
