/**
 * @module app/playground/page
 * @description Playground page component for the Taffy Layout documentation site.
 * Provides an interactive playground for experimenting with Taffy layout configurations.
 */

"use client";

import dynamic from "next/dynamic";
import SiteHeader from "@/components/layouts/SiteHeader";
import PageTransition from "@/features/docs/components/PageTransition";
import { usePathname } from "next/navigation";
import SiteFooter from "@/components/layouts/SiteFooter";
import {
  getUi,
  isLocale,
  localeBasePath,
  type Locale,
  DEFAULT_LOCALE,
} from "@/lib/locales";

/**
 * Lazy-loaded Playground component to avoid server-side rendering issues
 * and reduce initial bundle size. Standard dynamic import with ssr: false.
 */
const Playground = dynamic(() => import("@/features/playground/components"), {
  ssr: false,
});

/**
 * Playground page component that renders the interactive playground.
 * @returns The rendered playground page with site header and footer.
 */
export default function Page() {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];
  const locale: Locale = isLocale(possibleLocale)
    ? possibleLocale
    : DEFAULT_LOCALE;
  const ui = getUi(locale);
  const basePath = localeBasePath(locale);
  const navGroups = [
    { key: "docs", title: ui.docs, href: `${basePath}/docs` },
    { key: "api", title: ui.api, href: `${basePath}/docs/api` },
    { key: "benchmark", title: ui.benchmark, href: `${basePath}/benchmark` },
    { key: "playground", title: ui.playground, href: `${basePath}/playground` },
  ];

  return (
    <div
      className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 dark:bg-slate-950 dark:text-slate-50"
      data-pagefind-filter={locale === DEFAULT_LOCALE ? "lang:en" : undefined}
    >
      <SiteHeader
        locale={locale}
        navGroups={navGroups}
        activeGroup="playground"
      />
      <PageTransition>
        <div className="flex flex-1 flex-col">
          <Playground />
        </div>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
