/**
 * @module app/[locale]/benchmark/page
 * @description Locale-specific benchmark page component for the Taffy Layout documentation site.
 * Provides localized performance comparison between Taffy and Yoga layout engines.
 */

import { notFound } from "next/navigation";
import {
  isLocale,
  localeList,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/locales";
import { BenchmarkContent } from "../../benchmark/page";

/**
 * Generates static parameters for all non-default locale benchmark routes.
 * @returns An array of locale parameters for static generation.
 */
export async function generateStaticParams() {
  return localeList
    .filter((locale) => locale !== DEFAULT_LOCALE)
    .map((locale) => ({ locale }));
}

/**
 * Locale-specific benchmark page component that renders the localized benchmark interface.
 * @param params - The route parameters containing the locale.
 * @returns The rendered benchmark content with locale-specific UI strings.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) {
    notFound();
  }

  // Render the same benchmark page but with locale context
  return <BenchmarkContent locale={resolved.locale as Locale} />;
}
