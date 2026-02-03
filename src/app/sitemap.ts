/**
 * @module app/sitemap
 * @description Sitemap generation for the Taffy Layout documentation site.
 * Dynamically generates sitemap entries for all locales and documentation pages.
 */

import { MetadataRoute } from "next";
import { getAllDocSlugs } from "@/features/docs/lib/docs";
import { localeList, localeBasePath } from "@/lib/locales";

/**
 * Force static generation for the sitemap.
 */
export const dynamic = "force-static";

/**
 * Base URL for the Taffy Layout documentation site.
 */
const BASE_URL = "https://taffylayout.com";

/**
 * Generates the sitemap with all pages and documentation entries.
 * @returns A promise that resolves to the sitemap entries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Add homepage for each locale
  for (const locale of localeList) {
    const basePath = localeBasePath(locale);
    sitemap.push({
      url: `${BASE_URL}${basePath || "/"}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // Add all doc pages
  for (const locale of localeList) {
    const slugs = await getAllDocSlugs(locale);
    const basePath = localeBasePath(locale);

    for (const slug of slugs) {
      // Docs path construction: /docs/...
      // If the slug is 'intro', it maps to /docs
      const path = slug.join("/");
      const suffix = path === "intro" ? "" : `/${path}`;
      sitemap.push({
        url: `${BASE_URL}${basePath}/docs${suffix}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return sitemap;
}
