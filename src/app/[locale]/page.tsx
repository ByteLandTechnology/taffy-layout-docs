/**
 * @module app/[locale]/page
 * @description Locale-specific home page component for the Taffy Layout documentation site.
 * Renders localized homepage content with site header, footer, and home content for non-default locales.
 */

import { notFound } from "next/navigation";
import SiteHeader from "@/components/layouts/SiteHeader";
import SiteFooter from "@/components/layouts/SiteFooter";
import HomePage from "@/features/home/components";
import { type Feature, type HeroData } from "@/features/home/components/types";
import PageTransition from "@/features/docs/components/PageTransition";
import { getDoc } from "@/features/docs/lib/docs";
import { DEFAULT_LOCALE, getUi, isLocale, localeList } from "@/lib/locales";

/**
 * Generates static parameters for all non-default locale routes.
 * @returns An array of locale parameters for static generation.
 */
export async function generateStaticParams() {
  return localeList
    .filter((locale) => locale !== DEFAULT_LOCALE)
    .map((locale) => ({ locale }));
}

/**
 * Locale-specific home page component that renders localized homepage content.
 * @param params - The route parameters containing the locale.
 * @returns The rendered localized homepage with header, content, and footer.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  if (!isLocale(resolved.locale) || resolved.locale === DEFAULT_LOCALE) {
    notFound();
  }

  const doc = await getDoc(resolved.locale, []);
  if (!doc) {
    notFound();
  }
  const ui = getUi(resolved.locale);

  const hero = doc.data.hero as HeroData | undefined;
  const features = doc.data.features as Feature[] | undefined;

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
      data-pagefind-filter={`lang:${resolved.locale}`}
    >
      <SiteHeader
        locale={resolved.locale}
        navGroups={[
          {
            key: "docs",
            title: ui.docs,
            href: `/${resolved.locale}/docs`,
          },
          {
            key: "api",
            title: ui.api,
            href: `/${resolved.locale}/docs/api`,
          },
          {
            key: "benchmark",
            title: ui.benchmark,
            href: `/${resolved.locale}/benchmark`,
          },
          {
            key: "playground",
            title: ui.playground,
            href: `/${resolved.locale}/playground`,
          },
        ]}
      />
      <PageTransition>
        <HomePage
          hero={hero}
          features={features}
          ui={ui}
          locale={resolved.locale}
        />
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
