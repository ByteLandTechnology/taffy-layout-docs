/**
 * @module app/[locale]/layout
 * @description Locale-specific layout component for the Taffy Layout documentation site.
 * Wraps localized content with proper language attributes and pagefind filtering.
 */

import type { ReactNode } from "react";

/**
 * Locale layout component that wraps localized pages.
 * @param props - The component props.
 * @param props.children - Child components to render.
 * @param props.params - Route parameters containing the locale.
 * @returns The localized layout with proper language attributes.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div
      lang={locale}
      data-pagefind-filter={`lang:${locale}`}
      className="contents"
    >
      {children}
    </div>
  );
}
