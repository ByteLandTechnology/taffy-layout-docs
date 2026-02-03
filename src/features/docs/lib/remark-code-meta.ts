/**
 * @module features/docs/lib/remark-code-meta
 * @description Remark plugin for processing code blocks and inline code in MDX.
 * Adds metadata to code blocks including language, meta information, and inline markers.
 * Used to enable syntax highlighting, live code examples, and Sandpack integration.
 */

import { visit } from "unist-util-visit";

/**
 * Unist node interface for AST traversal
 * @interface Node
 * @property {string} type - Node type
 * @property {Node[]} [children] - Child nodes
 * @property {unknown} [key] - Additional properties
 */
interface Node {
  type: string;
  children?: Node[];
  [key: string]: unknown;
}

/**
 * Remark plugin to process code metadata
 * @returns {Function} Transformer function for AST
 * @example
 * const processor = unified().use(remarkCodeMeta);
 */
export function remarkCodeMeta() {
  return (tree: unknown) => {
    // Process block-level code nodes
    visit(
      tree as Node,
      "code",
      (node: {
        lang?: string;
        meta?: string;
        value?: string;
        data?: { hProperties?: Record<string, unknown> };
      }) => {
        const data = (node.data || {}) as {
          hProperties?: Record<string, unknown>;
        };
        data.hProperties = data.hProperties || {};

        // Always add data-language for all code blocks
        if (node.lang) {
          data.hProperties["data-language"] = node.lang;
        }

        if (node.meta) {
          data.hProperties["data-meta"] = node.meta;

          if (String(node.meta).split(" ").includes("live")) {
            data.hProperties["data-language"] = node.lang;
            data.hProperties["data-raw-code"] = node.value;
            node.lang = "text";
          }
        }

        node.data = data;
      },
    );

    // Process inline code nodes - add inline attribute marker
    visit(
      tree as Node,
      "inlineCode",
      (node: {
        value?: string;
        data?: { hProperties?: Record<string, unknown> };
      }) => {
        const data = (node.data || {}) as {
          hProperties?: Record<string, unknown>;
        };
        data.hProperties = data.hProperties || {};

        // Add inline attribute marker for easy component identification
        data.hProperties["data-inline"] = true;
        node.data = data;
      },
    );
  };
}
