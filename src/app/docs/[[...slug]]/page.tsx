/**
 * @module app/docs/[[...slug]]/page
 * @description Documentation page component for the Taffy Layout documentation site.
 * Handles routing for documentation pages with catch-all slug patterns.
 */

import { notFound, redirect } from "next/navigation";
import DocShell from "@/features/docs/components/DocShell";
import { getAllDocSlugs, getDoc } from "@/features/docs/lib/docs";
import { DEFAULT_LOCALE } from "@/lib/locales";
import { renderMdx } from "@/features/docs/lib/mdx";

/**
 * Disable dynamic parameters for static generation.
 */
export const dynamicParams = false;

/**
 * Generates static parameters for all documentation pages.
 * @returns An array of slug parameters for static generation.
 */
export async function generateStaticParams() {
  const slugs = await getAllDocSlugs(DEFAULT_LOCALE);
  return [{ slug: [] }, ...slugs.map((slug) => ({ slug }))];
}

/**
 * Props for the generateMetadata function.
 * @property params - The route parameters containing the slug.
 */
interface GenerateMetadataProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Generates metadata for the documentation page.
 * @param params - The route parameters.
 * @returns The metadata object for the page.
 */
export async function generateMetadata({ params }: GenerateMetadataProps) {
  const { slug = [] } = await params;
  const resolvedSlug = slug.length ? slug : ["intro"];
  const doc = await getDoc(DEFAULT_LOCALE, resolvedSlug);
  if (!doc) return {};
  return {
    title: doc.title,
    description:
      typeof doc.data.description === "string"
        ? doc.data.description
        : undefined,
  };
}

/**
 * Documentation page for the default locale.
 * Redirects to the localized path or renders the content if at the root.
 *
 * @param props - Component props.
 * @param props.params - Promise resolving to the route parameters.
 * @returns The page content.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  if (slug.length === 1 && slug[0] === "intro") {
    redirect("/docs");
  }
  const resolvedSlug = slug.length ? slug : ["intro"];
  const doc = await getDoc(DEFAULT_LOCALE, resolvedSlug);
  if (!doc) {
    notFound();
  }

  const isApi = resolvedSlug[0] === "api";
  const content = await renderMdx(doc.content, {
    basePath: "/docs",
    slug: resolvedSlug,
    isIndex: doc.isIndex,
    useMarkdownOnly: isApi,
  });
  return (
    <div data-pagefind-filter="lang:en" className="contents">
      <DocShell
        locale={DEFAULT_LOCALE}
        toc={doc.toc}
        slug={resolvedSlug}
        notice={undefined}
      >
        {content}
      </DocShell>
    </div>
  );
}
