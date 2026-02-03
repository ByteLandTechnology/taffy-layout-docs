"use client";

import { getUi, localeBasePath } from "@/lib/locales";
import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";
import type { SiteHeaderProps } from "./types";

/**
 * Site header barrel exports and default header composition.
 * @module components/layouts/SiteHeader
 * @description
 * Exposes the responsive site header and its subcomponents for reuse in other
 * layouts or custom header implementations.
 */

/** Re-export header-related types for advanced use cases. */
export type {
  NavGroup,
  SiteHeaderProps,
  DesktopHeaderProps,
  MobileHeaderProps,
} from "./types";
/** Desktop header layout component. */
export { DesktopHeader } from "./DesktopHeader";
/** Mobile header layout component. */
export { MobileHeader } from "./MobileHeader";
/** Site logo component used in header layouts. */
export { Logo } from "./parts/Logo";
/** Mobile menu button component used in header layouts. */
export { MenuButton } from "./parts/MenuButton";
/** Mobile menu overlay component used in header layouts. */
export { MobileMenu } from "./parts/MobileMenu";
/** Hook for mobile menu focus and state management. */
export { useMobileMenu } from "./hooks/useMobileMenu";

/**
 * Responsive site header that switches between desktop and mobile layouts.
 * @param props - Site header props including locale and navigation data.
 * @returns Site header JSX.
 */
export default function SiteHeader({
  locale = "en",
  navGroups = [],
  activeGroup,
  ui: externalUi,
}: SiteHeaderProps) {
  const ui = externalUi ?? getUi(locale);
  const basePath = localeBasePath(locale);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <DesktopHeader
            locale={locale}
            navGroups={navGroups}
            activeGroup={activeGroup}
            ui={ui}
            basePath={basePath}
          />
          <MobileHeader
            locale={locale}
            navGroups={navGroups}
            activeGroup={activeGroup}
            ui={ui}
            basePath={basePath}
          />
        </div>
      </div>
    </nav>
  );
}
