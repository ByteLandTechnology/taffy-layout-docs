/**
 * @module features/docs/lib/mdx
 * @description MDX rendering utilities for documentation content.
 * Provides the renderMdx function for compiling MDX content with custom components,
 * syntax highlighting, and Sandpack integration for live code examples.
 */

import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";

import { mdxComponents } from "@/features/docs/components/mdx-components";
import { remarkRewriteLinks } from "./remark-links";
import { remarkCodeMeta } from "./remark-code-meta";
import fs from "fs";
import path from "path";

/**
 * Render MDX content to React components
 * @param {string} source - Raw MDX content
 * @param {Object} options - Rendering options
 * @param {string} options.basePath - Base path for link resolution
 * @param {string[]} options.slug - URL slug segments
 * @param {boolean} [options.isIndex] - Whether this is an index page
 * @param {boolean} [options.useMarkdownOnly] - Use markdown format only (no MDX)
 * @returns {Promise<React.ReactNode>} Rendered React content
 * @example
 * const content = await renderMdx(mdxSource, {
 *   basePath: '/docs',
 *   slug: ['getting-started'],
 *   isIndex: false
 * });
 */
export async function renderMdx(
  source: string,
  options: {
    basePath: string;
    slug: string[];
    isIndex?: boolean;
    useMarkdownOnly?: boolean;
  },
): Promise<React.ReactNode> {
  const globalAny = globalThis as typeof globalThis & {
    RequestInfo?: unknown;
    Request?: unknown;
  };
  if (
    typeof globalAny.RequestInfo === "undefined" &&
    typeof globalAny.Request !== "undefined"
  ) {
    globalAny.RequestInfo = globalAny.Request;
  }

  // Read template files in parallel for better performance
  const [previewHelpers, setup, reactIndex, tsIndex] = await Promise.all([
    fs.promises.readFile(
      path.join(
        process.cwd(),
        "src/features/code/lib/sandpack-assets/taffy-preview.tsx",
      ),
      "utf-8",
    ),
    fs.promises.readFile(
      path.join(
        process.cwd(),
        "src/features/code/lib/sandpack-assets/sandbox-setup.ts",
      ),
      "utf-8",
    ),
    fs.promises.readFile(
      path.join(
        process.cwd(),
        "src/features/code/lib/sandpack-assets/react-index.tsx",
      ),
      "utf-8",
    ),
    fs.promises.readFile(
      path.join(
        process.cwd(),
        "src/features/code/lib/sandpack-assets/ts-index.ts",
      ),
      "utf-8",
    ),
  ]);

  const templates = {
    previewHelpers,
    setup,
    reactIndex,
    tsIndex,
  };

  const MDXCode = mdxComponents.code as React.ComponentType<
    React.ComponentProps<typeof mdxComponents.code> & { templates: unknown }
  >;

  const { content } = await compileMDX({
    source,
    components: {
      ...mdxComponents,
      code: (props: React.ComponentProps<typeof mdxComponents.code>) => (
        <MDXCode {...props} templates={templates} />
      ),
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        format: options.useMarkdownOnly ? "md" : "mdx",
        remarkPlugins: [
          remarkGfm,
          remarkGithubAlerts,
          remarkCodeMeta,
          [remarkRewriteLinks, options],
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: { className: ["anchor-link"] },
              test: (node: { tagName: string }) =>
                /^h[1-6]$/.test(node.tagName),
            },
          ],
          [
            rehypePrism,
            {
              showLineNumbers: false,
              ignoreMissing: true,
            },
          ],
        ],
      },
    },
  });

  return content;
}
