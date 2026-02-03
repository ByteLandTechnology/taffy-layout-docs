/**
 * @module features/code/components/CodeBlock/guards
 * @description Type guard functions for CodeBlock variant detection
 *
 * These functions determine which CodeBlock variant should be rendered
 * based on the props passed to the component. They follow the priority:
 * 1. Mermaid diagrams (special rendering)
 * 2. Live code blocks (interactive playground)
 * 3. Highlighted code blocks (syntax highlighted)
 * 4. Inline code (inline spans)
 * 5. Base code blocks (default fallback)
 */

/**
 * Props interface for variant checking functions
 * @interface VariantCheckProps
 */
export interface VariantCheckProps {
  /** Programming language identifier */
  language: string;
  /** CSS class names from the code block */
  className?: string;
  /** Whether this is an inline code element */
  inline?: boolean;
  /** Metadata from the code block */
  meta?: string;
  /** Code content to check */
  code?: string;
}

/**
 * Type guard: Check if this is a Mermaid diagram block
 *
 * A Mermaid block must:
 * - Not be inline (block-level only)
 * - Have language === 'mermaid'
 * - Have non-empty code content
 *
 * @param props - The variant check props
 * @returns True if the props represent a Mermaid diagram block
 *
 * @example
 * ```ts
 * const props = { language: 'mermaid', code: 'graph TD; A-->B;', inline: false };
 * if (isMermaidBlock(props)) {
 *   // Render Mermaid diagram
 * }
 * ```
 */
export function isMermaidBlock(props: VariantCheckProps): boolean {
  if (props.inline) return false;
  if (props.language !== "mermaid") return false;
  return Boolean(props.code && props.code.length > 0);
}

/**
 * Type guard: Check if this is a Live Code block
 *
 * A Live Code block must:
 * - Not be inline (block-level only)
 * - Have 'live' marker in className or meta
 * - Have language of tsx, ts, or typescript
 *
 * @param props - The variant check props
 * @returns True if the props represent a Live Code block
 *
 * @example
 * ```ts
 * const props = { language: 'tsx', className: 'language-tsx live', inline: false };
 * if (isLiveCodeBlock(props)) {
 *   // Render interactive code playground
 * }
 * ```
 */
export function isLiveCodeBlock(props: VariantCheckProps): boolean {
  if (props.inline) return false;

  // Check for live marker in className or meta
  const tokens = (props.className || "").split(" ");
  const meta = props.meta || "";
  const isLive = tokens.includes("live") || meta.split(" ").includes("live");

  if (!isLive) return false;

  // Check for valid language
  const lang = props.language?.toLowerCase() || "";
  const isValidLang = lang === "tsx" || lang === "ts" || lang === "typescript";

  return isValidLang;
}

/**
 * Type guard: Check if this is a highlighted code block
 *
 * A highlighted block must:
 * - Not be inline (block-level only)
 * - Have a language specified
 * - Have non-empty code content
 * - NOT be a mermaid or live code block (checked separately)
 *
 * @param props - The variant check props
 * @returns True if the props represent a highlighted code block
 *
 * @example
 * ```ts
 * const props = { language: 'javascript', code: 'const x = 1;', inline: false };
 * if (isHighlightedBlock(props)) {
 *   // Render syntax highlighted code block
 * }
 * ```
 */
export function isHighlightedBlock(props: VariantCheckProps): boolean {
  if (props.inline) return false;
  if (!props.language) return false;
  if (!props.code || props.code.length === 0) return false;

  // Exclude mermaid and live code blocks - they have their own handlers
  if (isMermaidBlock(props)) return false;
  if (isLiveCodeBlock(props)) return false;

  return true;
}

/**
 * Type guard: Check if this is an inline code element
 *
 * Used to detect inline code spans vs code blocks.
 * Simply checks the inline prop.
 *
 * @param props - Object containing the inline prop
 * @returns True if the props represent an inline code element
 *
 * @example
 * ```ts
 * const props = { inline: true };
 * if (isInlineCode(props)) {
 *   // Render inline code span
 * }
 * ```
 */
export function isInlineCode(
  props: Pick<VariantCheckProps, "inline">,
): boolean {
  return Boolean(props.inline);
}
