/**
 * @module app/robots
 * @description Robots.txt configuration for the Taffy Layout documentation site.
 * Defines crawler access rules and sitemap location for search engines.
 */

import { MetadataRoute } from "next";

/**
 * Force static generation for the robots.txt file.
 */
export const dynamic = "force-static";

/**
 * Generates the robots.txt configuration.
 * @returns The robots.txt configuration object.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://taffylayout.com/sitemap.xml",
  };
}
