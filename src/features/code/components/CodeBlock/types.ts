/**
 * @module features/code/components/CodeBlock/types
 * @description Type definitions for CodeBlock component and its variants
 *
 * Provides comprehensive type definitions for code blocks, including
 * syntax highlighting, live code execution, mermaid diagrams, and
 * various block variants. Used throughout the documentation system.
 */

import type { ComponentProps } from "react";

/**
 * Data structure representing a node in parsed code data
 * Used for processing code blocks from MDX/markdown
 * @interface CodeDataNode
 */
export interface CodeDataNode {
  /** Raw value/content of the node */
  value?: string;
  /** Metadata string from the code block */
  meta?: string;
  /** Additional data properties */
  data?: {
    /** Metadata extracted from data */
    meta?: string;
  };
  /** Child nodes for nested structures */
  children?: CodeDataNode[];
}

/**
 * Template strings for live code execution environment
 * @interface CodeTemplates
 */
export interface CodeTemplates {
  /** Helper functions for preview rendering */
  previewHelpers: string;
  /** Setup code for the environment */
  setup: string;
  /** React component index file content */
  reactIndex: string;
  /** TypeScript configuration content */
  tsIndex: string;
}

/**
 * Props for the CodeBlock component
 * Extends native code element props with additional metadata
 * @interface CodeBlockProps
 * @extends ComponentProps<"code">
 */
export interface CodeBlockProps extends ComponentProps<"code"> {
  /** Whether this is an inline code element */
  inline?: boolean;
  /** Template strings for live code execution */
  templates?: CodeTemplates;
  /** Programming language identifier */
  "data-language"?: string;
  /** Raw code content */
  "data-raw-code"?: string;
  /** Metastring from markdown code fence */
  metastring?: string;
  /** Metadata from the code block */
  meta?: string;
  /** Metadata attribute */
  "data-meta"?: string;
  /** Parsed node data */
  node?: CodeDataNode;
}

/**
 * Context value for sharing code block data
 * @interface CodeBlockContextValue
 */
export interface CodeBlockContextValue {
  /** Code content */
  code: string;
  /** Programming language */
  language: string;
  /** Parsed metadata */
  meta: Record<string, unknown>;
}

/**
 * Base props for code block variant components
 * @interface CodeBlockVariantProps
 */
export interface CodeBlockVariantProps {
  /** Code content to display */
  code: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Props for language-specific code block variants
 * @interface LanguageBlockProps
 * @extends CodeBlockVariantProps
 */
export interface LanguageBlockProps extends CodeBlockVariantProps {
  /** Programming language identifier */
  language: string;
}

/**
 * Props for highlighted code blocks with syntax highlighting
 * @interface HighlightedBlockProps
 * @extends LanguageBlockProps
 */
export interface HighlightedBlockProps extends LanguageBlockProps {
  /** Pre-highlighted React elements */
  highlightedChildren?: React.ReactNode;
}

/**
 * Props for live code execution blocks
 * @interface LiveCodeBlockProps
 * @extends CodeBlockVariantProps
 */
export interface LiveCodeBlockProps extends CodeBlockVariantProps {
  /** Programming language (TypeScript variants only) */
  language: "ts" | "tsx";
  /** Template strings for code execution environment */
  templates?: CodeTemplates;
}

/**
 * Type guard: Check if the language is Mermaid
 * @param language - The language identifier to check
 * @returns True if the language is "mermaid"
 */
export function isMermaidLanguage(language: string): boolean {
  return language === "mermaid";
}

/**
 * Type guard: Check if the language supports live code execution
 * @param language - The language identifier to check
 * @returns True if the language is TypeScript/TSX
 */
export function isLiveCodeLanguage(language: string): boolean {
  const lang = language.toLowerCase();
  return lang === "tsx" || lang === "ts" || lang === "typescript";
}

/**
 * Type guard: Check if the code block has live execution metadata
 * @param props - The CodeBlockProps to check
 * @returns True if the block has "live" marker in className or meta
 */
export function hasLiveMeta(props: CodeBlockProps): boolean {
  const tokens = (props.className || "").split(" ");
  const meta = props.metastring || props.meta || props["data-meta"] || "";
  return tokens.includes("live") || String(meta).split(" ").includes("live");
}
