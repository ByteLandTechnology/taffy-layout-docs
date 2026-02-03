/**
 * @module app/[locale]/playground/page
 * @description Locale-specific playground page component for the Taffy Layout documentation site.
 * Provides localized interactive playground for experimenting with Taffy layout configurations.
 */

import { notFound } from "next/navigation";
import { isLocale, localeList, DEFAULT_LOCALE } from "@/lib/locales";
import PlaygroundPage from "../../playground/page";

/**
 * Generates static parameters for all non-default locale playground routes.
 * @returns An array of locale parameters for static generation.
 */
export async function generateStaticParams() {
  return localeList
    .filter((locale) => locale !== DEFAULT_LOCALE)
    .map((locale) => ({ locale }));
}

/**
 * Locale-specific playground page component that renders the interactive playground.
 * @param params - The route parameters containing the locale.
 * @returns The rendered playground page.
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

  // Render the same playground page
  return <PlaygroundPage />;
}
