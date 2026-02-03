/**
 * @module features/docs/lib/sandpack-utils
 * @description Utility functions for building Sandpack file configurations.
 * Provides helpers for creating file structures for live code examples
 * with support for React, TypeScript, and custom themes.
 */

/**
 * Template files for Sandpack configuration
 * @interface Templates
 * @property {string} [previewHelpers] - Preview helper code
 * @property {string} [setup] - Sandbox setup code
 * @property {string} [reactIndex] - React index file template
 * @property {string} [tsIndex] - TypeScript index file template
 */
interface Templates {
  previewHelpers?: string;
  setup?: string;
  reactIndex?: string;
  tsIndex?: string;
}

/**
 * Sandpack file configuration
 * @interface SandpackFile
 * @property {string} code - File content
 * @property {boolean} [active] - Whether this file is active/visible
 * @property {boolean} [hidden] - Whether this file is hidden from editor
 * @property {boolean} [readOnly] - Whether this file is read-only
 */
export interface SandpackFile {
  code: string;
  active?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
}

/**
 * Build Sandpack file configuration for live code examples
 * @param {string} code - Source code to include
 * @param {"ts" | "tsx"} language - Language (TypeScript or TSX)
 * @param {Templates} [templates] - Template files
 * @param {"light" | "dark"} [theme] - Color theme
 * @returns {Record<string, SandpackFile>} Sandpack file configuration
 * @example
 * const files = buildSandpackFiles(
 *   'export default function App() { return <div>Hello</div> }',
 *   'tsx',
 *   { reactIndex: '...' },
 *   'light'
 * );
 */
export function buildSandpackFiles(
  code: string,
  language: "ts" | "tsx",
  templates?: Templates,
  theme: "light" | "dark" = "light",
): Record<string, SandpackFile> {
  const isTsx = language === "tsx";

  const normalizedCode = (() => {
    if (!isTsx) return code;
    if (/\bexport\s+default\b/.test(code)) return code;
    // Indent code by 2 spaces for better readability in full screen editor
    const indentedCode = code
      .split("\n")
      .map((line) => (line.length > 0 ? "  " + line : line))
      .join("\n");
    return `export default function App() {\n${indentedCode}\n}`;
  })();

  const isDark = theme === "dark";
  const bg = isDark ? "#0f172a" : "#f8fafc";
  const pattern = isDark ? "#334155" : "#cbd5e1";

  /* Grid background style from Playground.css */
  const stylesCss = `
:root {
  --taffy-root-bg: ${isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.45)"};
  --taffy-root-border: ${isDark ? "1.5px solid rgba(148, 163, 184, 0.2)" : "1.5px solid rgba(255, 255, 255, 0.7)"};
  --taffy-root-text: ${isDark ? "#e2e8f0" : "#1e293b"};
}

body {
  padding: 20px;
  background-color: ${bg};
  background-image:
    radial-gradient(${pattern} 1px, transparent 1px),
    radial-gradient(${pattern} 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  font-family: system-ui, -apple-system, sans-serif;
  color: ${isDark ? "#e2e8f0" : "#1e293b"};
}
`;

  const importStyles = `import "./styles.css";\n`;

  if (isTsx) {
    const defaultIndexTsx = `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`;

    // Use template or default. If template exists, PREPEND style import if not present?
    // Actually, safest is to assume template handles it OR just prepend it.
    // But for now, if template is provided, we assume it's "raw" and we might need to inject styles.
    // However, the issue is that if we hide index.tsx, user can't see/edit it.
    // Let's assume for standard use case (template empty), we use our default with styles.
    const indexTsxCode = templates?.reactIndex || defaultIndexTsx;
    // If using custom template, ensure it has styles import? Or maybe user template already has it.
    // For now let's just use the logic:
    // 1. App.tsx: pure code
    // 2. index.tsx: glue code (hidden)

    return {
      "App.tsx": {
        code: importStyles + normalizedCode,
        active: true,
      },
      "index.tsx": {
        code: indexTsxCode,
        hidden: true,
        readOnly: true,
      },
      "sandbox-setup.ts": {
        code: templates?.setup || "",
        hidden: true,
        readOnly: true,
      },
      "taffy-preview.tsx": {
        code: templates?.previewHelpers || "",
        hidden: true,
        readOnly: true,
      },
      "styles.css": {
        code: stylesCss,
        hidden: true,
        readOnly: true,
      },
    };
  } else {
    return {
      "index.ts": {
        code:
          importStyles +
          (templates?.tsIndex || "").replace("// {{CODE}}", code),
        active: true,
      },
      "sandbox-setup.ts": {
        code: templates?.setup || "",
        hidden: true,
        readOnly: true,
      },
      "taffy-preview.tsx": {
        code: templates?.previewHelpers || "",
        hidden: true,
        readOnly: true,
      },
      "styles.css": {
        code: stylesCss,
        hidden: true,
        readOnly: true,
      },
    };
  }
}
