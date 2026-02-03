/**
 * @module mdx-components
 * @description MDX component mapping for rendering documentation content.
 * Provides custom implementations for standard Markdown elements with enhanced styling and functionality.
 */

import Link from "next/link";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import CodeBlock from "@/features/code/components/CodeBlock";

/**
 * Check if a URL is external (http, https, or mailto)
 * @param href - URL to check
 * @returns Whether the URL is external
 */
const isExternal = (href: string) =>
  href.startsWith("http://") ||
  href.startsWith("https://") ||
  href.startsWith("mailto:");

/**
 * MDX component mapping object
 * Maps standard Markdown elements to custom React components with enhanced functionality
 */
export const mdxComponents = {
  /**
   * Custom anchor component.
   * Handles external links (opens in new tab) and standard internal links.
   */
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    if (href.startsWith("#")) {
      return <a href={href} {...props} />;
    }
    if (isExternal(href)) {
      return <a href={href} target="_blank" rel="noreferrer" {...props} />;
    }
    return <Link href={href} {...props} />;
  },
  /**
   * Custom pre component.
   * Handles code blocks, including special rendering for Mermaid diagrams and LiveCode blocks.
   * Wraps content in a scrollable container.
   */
  pre: (props: ComponentProps<"pre">) => {
    const child = Array.isArray(props.children)
      ? props.children[0]
      : props.children;
    if (child && typeof child === "object" && "type" in child) {
      const element = child as {
        type?: { name?: string };
        props?: {
          code?: string;
          className?: string;
          metastring?: string;
          children?: unknown;
          [key: string]: unknown;
        };
      };
      const childClassName = element.props?.className || "";
      const meta =
        element.props?.metastring || element.props?.["data-meta"] || "";
      const isLive =
        childClassName.includes("language-") &&
        String(meta).split(" ").includes("live");
      if (
        element.type?.name === "Mermaid" ||
        element.type?.name === "LiveCode" ||
        element.props?.code ||
        isLive
      ) {
        return <div className="my-6">{child as ReactNode}</div>;
      }
      // Extract language class from child code element for consistency
      const languageClass =
        childClassName.split(" ").find((c) => c.startsWith("language-")) || "";
      const baseClasses = ["overflow-x-auto"];
      if (props.className) baseClasses.push(props.className);
      if (languageClass) baseClasses.push(languageClass);
      const combinedClassName = baseClasses.join(" ");
      return (
        <pre className={combinedClassName} suppressHydrationWarning>
          {props.children}
        </pre>
      );
    }
    return (
      <pre
        className={`overflow-x-auto ${props.className || ""}`}
        suppressHydrationWarning
      >
        {props.children}
      </pre>
    );
  },
  /**
   * Custom code component.
   * Distinguishes between inline code and code blocks suitable for CodeBlock component.
   */
  code: (props: ComponentProps<"code"> & { "data-inline"?: boolean }) => {
    // Identify inline code: if code is not wrapped in pre tag and has no language attribute, or has data-inline attribute, treat as inline code
    const isInline =
      props["data-inline"] || !props.className?.includes("language-");

    return <CodeBlock {...props} inline={isInline} />;
  },
  /**
   * Custom img component.
   * Optimizes images using Next.js Image component and adds basic styling.
   */
  img: (props: ComponentProps<"img">) => (
    <Image
      src={(props.src as string) || ""}
      alt={props.alt || ""}
      width={1200}
      height={800}
      sizes="(min-width: 1024px) 768px, 100vw"
      className={`h-auto w-full max-w-full rounded-xl border border-slate-200 ${props.className || ""}`}
    />
  ),
  /**
   * Custom table component.
   * Wraps the table in a scrollable container for responsiveness.
   */
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrapper my-6 w-full overflow-x-auto">
      <table {...props} className={`w-full ${props.className || ""}`} />
    </div>
  ),
};
