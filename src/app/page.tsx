/**
 * @module app/page
 * @description Root page component for the Taffy Layout documentation site.
 * Renders the default (English) homepage with site header, footer, and home content.
 */

import { notFound } from "next/navigation";
import SiteHeader from "@/components/layouts/SiteHeader";
import SiteFooter from "@/components/layouts/SiteFooter";
import HomePage from "@/features/home/components";
import { type Feature, type HeroData } from "@/features/home/components/types";
import PageTransition from "@/features/docs/components/PageTransition";
import { getDoc } from "@/features/docs/lib/docs";
import { DEFAULT_LOCALE, getUi } from "@/lib/locales";

/**
 * Root page component that renders the default homepage.
 * Fetches documentation content and UI strings for the default locale.
 * @returns The rendered homepage with header, content, and footer.
 */
export default async function Page() {
  const doc = await getDoc(DEFAULT_LOCALE, []);
  if (!doc) {
    notFound();
  }
  const ui = getUi(DEFAULT_LOCALE);

  const hero = doc.data.hero as HeroData | undefined;
  const features = doc.data.features as Feature[] | undefined;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
      data-pagefind-filter={`lang:${DEFAULT_LOCALE}`}
    >
      <SiteHeader
        locale={DEFAULT_LOCALE}
        navGroups={[
          { key: "docs", title: ui.docs, href: "/docs" },
          { key: "api", title: ui.api, href: "/docs/api" },
          { key: "benchmark", title: ui.benchmark, href: "/benchmark" },
          { key: "playground", title: ui.playground, href: "/playground" },
        ]}
      />
      <PageTransition>
        <HomePage
          hero={hero}
          features={features}
          ui={ui}
          locale={DEFAULT_LOCALE}
        />
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
