/**
 * @module app/[locale]/docs/[[...slug]]/page
 * @description Locale-specific documentation page component for the Taffy Layout documentation site.
 * Handles routing for localized documentation pages with catch-all slug patterns.
 */

import { notFound, redirect } from "next/navigation";
import DocShell from "@/features/docs/components/DocShell";
import { getAllDocSlugs, getDoc } from "@/features/docs/lib/docs";
import { DEFAULT_LOCALE, getUi, isLocale, localeList } from "@/lib/locales";
import { renderMdx } from "@/features/docs/lib/mdx";

/**
 * Disable dynamic parameters for static generation.
 */
export const dynamicParams = false;

/**
 * Generates static parameters for all locale-specific documentation pages.
 * @returns An array of locale and slug parameters for static generation.
 */
export async function generateStaticParams() {
  const locales = localeList.filter((locale) => locale !== DEFAULT_LOCALE);
  const params = [] as { locale: string; slug?: string[] }[];

  // Fetch slugs in parallel for better performance
  const [defaultSlugs, ...localeSlugs] = await Promise.all([
    getAllDocSlugs(DEFAULT_LOCALE),
    ...locales.map((locale) => getAllDocSlugs(locale)),
  ]);

  locales.forEach((locale, index) => {
    const slugs = localeSlugs[index];
    const combined = [...slugs, ...defaultSlugs];
    const seen = new Set<string>();
    combined.forEach((slug) => {
      const key = slug.join("/");
      if (seen.has(key)) return;
      seen.add(key);
      params.push({ locale, slug });
    });
    params.push({ locale, slug: [] });
  });

  return params;
}

/**
 * Generates metadata for the localized documentation page.
 * @param props - Component props containing the route parameters.
 * @param props.params - Promise resolving to the route parameters.
 * @returns The metadata object for the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const resolved = await params;
  if (!isLocale(resolved.locale) || resolved.locale === DEFAULT_LOCALE)
    return {};
  const slug = resolved.slug ?? [];
  const resolvedSlug = slug.length ? slug : ["intro"];
  const sourceLocale =
    resolvedSlug[0] === "api" ? DEFAULT_LOCALE : resolved.locale;
  const doc = await getDoc(sourceLocale, resolvedSlug);
  if (!doc) return {};
  return {
    title: doc.title,
    description:
      typeof doc.data.description === "string"
        ? doc.data.description
        : undefined,
    openGraph: {
      title: doc.title,
      description:
        typeof doc.data.description === "string"
          ? doc.data.description
          : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description:
        typeof doc.data.description === "string"
          ? doc.data.description
          : undefined,
    },
  };
}

/**
 * The main documentation page component capable of rendering Markdown/MDX content.
 * It handles:
 * - Locale validation and redirection.
 * - Fetching documentation content (with fallback to default locale).
 * - Rendering the documentation shell and MDX content.
 *
 * @param params - Route parameters including locale and slug segments.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const resolved = await params;
  if (!isLocale(resolved.locale) || resolved.locale === DEFAULT_LOCALE) {
    notFound();
  }

  const slug = resolved.slug ?? [];
  if (slug.length === 1 && slug[0] === "intro") {
    redirect(`/${resolved.locale}/docs`);
  }
  const resolvedSlug = slug.length ? slug : ["intro"];
  const ui = getUi(resolved.locale);
  const isApi = resolvedSlug[0] === "api";

  // Fetch docs in parallel for better performance
  const [primaryDoc, fallbackDoc] = await Promise.all([
    getDoc(resolved.locale, resolvedSlug),
    getDoc(DEFAULT_LOCALE, resolvedSlug),
  ]);
  const doc = isApi ? fallbackDoc : primaryDoc || fallbackDoc;
  if (!doc) {
    notFound();
  }
  const notice =
    isApi || (primaryDoc == null && fallbackDoc != null)
      ? ui.missingTranslation
      : undefined;

  const basePath = `/${resolved.locale}/docs`;
  const content = await renderMdx(doc.content, {
    basePath,
    slug: resolvedSlug,
    isIndex: doc.isIndex,
    useMarkdownOnly: isApi,
  });
  return (
    <DocShell
      locale={resolved.locale}
      toc={doc.toc}
      slug={resolvedSlug}
      notice={notice}
    >
      {content}
    </DocShell>
  );
}
