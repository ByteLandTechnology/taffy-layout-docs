/**
 * @module CodeBlock
 * @description Main entry point for the CodeBlock component system. Exports all code block variants,
 * type guards, and types. Provides a smart CodeBlock component that automatically selects
 * the appropriate variant based on language and metadata.
 *
 * @example
 * ```tsx
 * <CodeBlock className="language-typescript" data-language="typescript">
 *   {code}
 * </CodeBlock>
 * ```
 */

"use client";

// Variant components
export { MermaidBlock } from "./MermaidBlock";
export { LiveCodeBlock } from "./LiveCodeBlock";
export { HighlightedBlock } from "./HighlightedBlock";
export { InlineCode } from "./InlineCode";
export { CodeBlockBase } from "./CodeBlockBase";

// Type guards
export { isMermaidBlock, isLiveCodeBlock, isHighlightedBlock } from "./guards";

// Types
export type {
  CodeBlockProps,
  CodeTemplates,
  CodeDataNode,
  CodeBlockVariantProps,
  LanguageBlockProps,
  HighlightedBlockProps,
  LiveCodeBlockProps,
} from "./types";

// Default export - Smart selector
import { MermaidBlock } from "./MermaidBlock";
import { LiveCodeBlock } from "./LiveCodeBlock";
import { HighlightedBlock } from "./HighlightedBlock";
import { InlineCode } from "./InlineCode";
import { CodeBlockBase } from "./CodeBlockBase";
import { isMermaidBlock, isLiveCodeBlock, isHighlightedBlock } from "./guards";
import type { CodeBlockProps } from "./types";
import { normalizeLanguage } from "@/lib/language-utils";

/**
 * Recursively extracts text content from various React node types.
 * Handles strings, numbers, arrays, and React elements.
 * @param value - The value to extract text from
 * @returns The extracted text content
 */
function extractText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(extractText).join("");
  if (value && typeof value === "object" && "props" in (value as object)) {
    return extractText(
      (value as { props: { children: unknown } }).props?.children,
    );
  }
  return "";
}

/**
 * Smart code block component that automatically selects the appropriate variant
 * based on language and metadata. Supports inline code, mermaid diagrams,
 * live code blocks, syntax-highlighted blocks, and basic code blocks.
 * @param props - The component props
 * @param props.className - CSS class names
 * @param props.children - Child elements
 * @param props.inline - Whether to render as inline code
 * @returns The appropriate code block variant
 */
export default function CodeBlock({
  className,
  children,
  inline,
  ...props
}: CodeBlockProps) {
  // Extract language from className
  const tokens = (className || "").split(" ").filter(Boolean);
  const languageToken = tokens
    .find((token) => token.startsWith("language-"))
    ?.replace("language-", "");
  const dataLanguage = props["data-language"];
  let language = (dataLanguage || languageToken || "").toLowerCase();
  language = normalizeLanguage(language);

  // Extract metadata
  const meta =
    props.metastring ||
    props.meta ||
    props["data-meta"] ||
    props.node?.data?.meta ||
    props.node?.meta ||
    "";

  // Extract raw code
  const dataRawCode = props["data-raw-code"];
  const rawValue =
    dataRawCode ||
    props.node?.value ||
    props.node?.children?.map((child) => child.value || "").join("") ||
    extractText(children);
  const value = String(rawValue).replace(/\n$/, "");

  // Build props for variant detection
  const variantProps = {
    language,
    className,
    inline,
    meta: String(meta),
    code: value,
  };

  // Type guard checks in priority order
  // Inline code should have highest priority to ensure it's not treated as block-level
  if (inline) {
    return <InlineCode className={className}>{children}</InlineCode>;
  }

  if (isMermaidBlock(variantProps)) {
    return <MermaidBlock code={value} className={className} />;
  }

  if (isLiveCodeBlock(variantProps)) {
    const liveLang = language.includes("x") ? "tsx" : "ts";
    return (
      <LiveCodeBlock
        code={value}
        language={liveLang}
        templates={props.templates}
        className={className}
      />
    );
  }

  if (isHighlightedBlock(variantProps)) {
    return (
      <HighlightedBlock
        code={value}
        language={language}
        highlightedChildren={children}
        className={className}
      />
    );
  }

  // Default: base code block
  return (
    <CodeBlockBase code={value} language={language} className={className} />
  );
}
