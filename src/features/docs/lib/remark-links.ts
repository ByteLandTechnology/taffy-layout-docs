/**
 * @module features/docs/lib/remark-links
 * @description Remark plugin for rewriting relative links in MDX content.
 * Transforms relative markdown links (e.g., ./other-file.md) into proper documentation
 * URLs with locale prefixes and cleaned paths.
 */

import path from "node:path";
import { visit } from "unist-util-visit";

/**
 * Check if a URL is external (not a relative link to rewrite)
 * @param {string} url - URL to check
 * @returns {boolean} True if URL is external
 * @example
 * const isExt = isExternal('https://example.com'); // true
 * const isRel = isExternal('./local-file.md'); // false
 */
const isExternal = (url: string): boolean =>
  url.startsWith("http://") ||
  url.startsWith("https://") ||
  url.startsWith("mailto:") ||
  url.startsWith("tel:") ||
  url.startsWith("#") ||
  url.startsWith("/");

interface Node {
  type: string;
  children?: Node[];
  [key: string]: unknown;
}

/**
 * Remark plugin to rewrite relative markdown links to proper documentation URLs
 * @param {Object} options - Plugin options
 * @param {string} options.basePath - Base path for link resolution
 * @param {string[]} options.slug - Current URL slug segments
 * @param {boolean} [options.isIndex] - Whether this is an index page
 * @returns {Function} Transformer function for AST
 * @example
 * const processor = unified().use(remarkRewriteLinks, {
 *   basePath: '/docs',
 *   slug: ['getting-started'],
 *   isIndex: false
 * });
 */
export function remarkRewriteLinks(options: {
  basePath: string;
  slug: string[];
  isIndex?: boolean;
}) {
  const basePath = options.basePath || "";
  const docPath = `/${options.slug.join("/")}`;
  const currentDir = options.isIndex
    ? docPath || "/"
    : path.posix.dirname(docPath || "/");

  return (tree: unknown) => {
    visit(tree as Node, "link", (node: { url?: string }) => {
      if (!node.url) return;
      if (isExternal(node.url)) return;

      const resolved = path.posix.normalize(
        path.posix.join(currentDir, node.url),
      );
      let clean = resolved.replace(/\.mdx?$/i, "");
      if (clean.endsWith("/index")) {
        clean = clean.replace(/\/index$/, "");
      }
      const suffix = clean.replace(/^\//, "");
      node.url = suffix ? `${basePath}/${suffix}` : basePath || "/";
    });
  };
}
