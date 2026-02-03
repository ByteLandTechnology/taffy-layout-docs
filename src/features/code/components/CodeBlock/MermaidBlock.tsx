/**
 * @module MermaidBlock
 * @description Mermaid diagram code block component. Dynamically imports and renders
 * Mermaid diagrams with a loading state while the component is being loaded.
 * Uses dynamic imports to avoid SSR issues with the Mermaid library.
 */

"use client";

import dynamic from "next/dynamic";
import type { CodeBlockVariantProps } from "./types";

/**
 * Dynamically import Mermaid component to avoid SSR issues.
 * Shows a loading spinner while the component is loading.
 */
const Mermaid = dynamic(() => import("@/features/code/components/Mermaid"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
    </div>
  ),
});

/**
 * Renders a Mermaid diagram from code.
 * Dynamically loads the Mermaid component with a loading state.
 * @param props - The component props
 * @param props.code - The Mermaid diagram source code
 * @param props.className - Additional CSS class names
 * @returns A container with the dynamically loaded Mermaid diagram
 */
export function MermaidBlock({ code, className }: CodeBlockVariantProps) {
  return (
    <div className={className}>
      <Mermaid code={code} />
    </div>
  );
}
