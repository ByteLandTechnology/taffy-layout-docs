/**
 * @module LiveCodeBlock
 * @description Live code block component that provides an interactive code playground.
 * Dynamically imports the LiveCode component with Sandpack to avoid SSR issues.
 * Shows a skeleton loader while the component is being loaded.
 */

"use client";

import dynamic from "next/dynamic";
import { SandpackSkeleton } from "./SandpackSkeleton";
import type { LiveCodeBlockProps } from "./types";

/**
 * Dynamically import LiveCode component to avoid SSR issues with Sandpack.
 * Shows a skeleton loader while the component is loading.
 */
const LiveCode = dynamic(() => import("@/features/code/components/LiveCode"), {
  ssr: false,
  loading: () => <SandpackSkeleton />,
});

/**
 * Renders an interactive live code playground.
 * Dynamically loads the LiveCode component with Sandpack integration.
 * @param props - The component props
 * @param props.code - The initial code to display in the editor
 * @param props.language - The programming language for the editor
 * @param props.templates - Optional templates for the live code environment
 * @param props.className - Additional CSS class names
 * @returns A container with the dynamically loaded live code editor
 */
export function LiveCodeBlock({
  code,
  language,
  templates,
  className,
}: LiveCodeBlockProps) {
  return (
    <div className={className}>
      <LiveCode code={code} language={language} templates={templates} />
    </div>
  );
}
