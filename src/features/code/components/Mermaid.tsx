/**
 * @module features/code/components/Mermaid
 * @description Renders Mermaid diagrams from code strings
 *
 * This component dynamically imports mermaid on the client side to avoid SSR issues
 * and renders diagrams with theme support (dark/light mode).
 */

"use client";

// import mermaid from 'mermaid'
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

/**
 * Props for the Mermaid diagram component
 * @property code - The Mermaid diagram source code to render
 */
export default function Mermaid({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>("");
  const id = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    // Dynamically import mermaid to avoid SSR issues
    import("mermaid").then((m) => {
      if (cancelled) return;
      const mermaid = m.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "neutral",
        // Mermaid theme variables can be customized here if needed
        themeVariables: {
          fontFamily: "system-ui, sans-serif",
          background: "transparent",
        },
      });
      mermaid
        .render(`mermaid-${id}`, code)
        .then(({ svg }) => {
          if (!cancelled) setSvg(svg);
        })
        .catch(() => {
          if (!cancelled) setSvg("");
        });
    });
    return () => {
      cancelled = true;
    };
  }, [code, id, resolvedTheme]);

  if (!svg) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram overflow-x-auto rounded-2xl p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
