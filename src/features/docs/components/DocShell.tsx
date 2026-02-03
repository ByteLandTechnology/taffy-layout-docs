/**
 * @module DocShell
 * @description Main layout shell for documentation pages. Provides the complete documentation
 * page structure including header, sidebar navigation, content area, and table of contents.
 */

import type { ReactNode } from "react";
import SiteHeader from "@/components/layouts/SiteHeader";
import SiteFooter from "@/components/layouts/SiteFooter";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import Toc from "./Toc";
import ScrollToTopOnNavigate from "./ScrollToTopOnNavigate";
import ColumnTransition from "./ColumnTransition";
import { getSidebar } from "@/features/docs/lib/docs";
import { DEFAULT_LOCALE, getUi, type Locale } from "@/lib/locales";
import type { TocItem } from "@/features/docs/lib/docs";

import { buildNavigationGroups } from "@/features/docs/lib/navigation";

/**
 * Props for the DocShell component
 */
interface DocShellProps {
  /** Current locale for the page */
  locale: Locale;
  /** URL slug segments for the current page */
  slug?: string[];
  /** Table of contents items */
  toc?: TocItem[];
  /** Optional notice message to display */
  notice?: string;
  /** Page content */
  children: ReactNode;
}

/**
 * Main documentation page layout shell
 * @param props - Component properties
 * @returns Complete documentation page layout
 */
export default async function DocShell({
  locale,
  slug = [],
  toc = [],
  notice,
  children,
}: DocShellProps) {
  const items = await getSidebar(locale);
  const defaultItems =
    locale === DEFAULT_LOCALE ? items : await getSidebar(DEFAULT_LOCALE);
  const ui = getUi(locale);

  /* Logic extracted to lib/navigation.ts */
  const { navGroups, activeGroup, sidebarItems } = buildNavigationGroups(
    locale,
    items,
    defaultItems,
    ui,
    slug,
  );
  const contentKey = slug.length ? slug.join("/") : "intro";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <ScrollToTopOnNavigate />
      <SiteHeader
        locale={locale}
        navGroups={navGroups}
        activeGroup={activeGroup?.segment}
        ui={ui}
      />
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="doc-layout grid gap-8 lg:grid-cols-[280px,minmax(0,1fr)] xl:grid-cols-[280px,minmax(0,1fr),220px]">
          <aside className="doc-layout__sidebar hidden lg:block">
            <div className="doc-panel sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <Sidebar items={sidebarItems} />
            </div>
          </aside>
          <main className="min-w-0">
            {/* Mobile Menu */}
            <MobileMenu items={sidebarItems} ui={ui} />
            <ColumnTransition motionKey={`content-${contentKey}`}>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
                {notice ? (
                  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {notice}
                  </div>
                ) : null}
                <div className="doc-content">{children}</div>
              </div>
            </ColumnTransition>
          </main>
          <aside className="doc-layout__toc hidden xl:block">
            <div className="doc-panel sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <ColumnTransition motionKey={`toc-${contentKey}`}>
                <Toc items={toc} title={ui.onThisPage} />
              </ColumnTransition>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
