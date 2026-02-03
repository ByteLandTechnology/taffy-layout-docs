/**
 * @module features/code/components/LiveCode
 * @description LiveCode component system for interactive code demos with Sandpack
 *
 * A comprehensive code playground component that supports live editing,
 * preview rendering, and console output. Built on top of CodeSandbox's Sandpack.
 *
 * Exports both compound component exports for flexible composition and a
 * default export for quick usage.
 */

"use client";

import { Code, Eye, Terminal } from "lucide-react";
import { LiveCodeProvider } from "./LiveCodeProvider";
import {
  LiveCodeFrame,
  LiveCodeHeader,
  LiveCodeTabs,
  LiveCodeTab,
  LiveCodeBadge,
  LiveCodeCodeView,
  LiveCodePreviewView,
  LiveCodeConsoleView,
  LiveCodeEditButton,
} from "./parts";
import { LiveCodeSandpackProvider } from "./LiveCodeSandpackProvider";
import type { LiveCodeProps } from "./types";

// Compound Components export
/**
 * Compound components for building custom LiveCode layouts
 *
 * Provides flexible composition options:
 * - LiveCode.Provider: State management wrapper
 * - LiveCode.Frame: Visual container
 * - LiveCode.Header: Tab navigation and controls
 * - LiveCode.Tabs: Tab container
 * - LiveCode.Tab: Individual tab
 * - LiveCode.Badge: Language badge
 * - LiveCode.CodeView: Code display
 * - LiveCode.PreviewView: Live preview
 * - LiveCode.ConsoleView: Console output
 * - LiveCode.EditButton: Fullscreen edit button
 */
export const LiveCode = {
  Provider: LiveCodeProvider,
  Frame: LiveCodeFrame,
  Header: LiveCodeHeader,
  Tabs: LiveCodeTabs,
  Tab: LiveCodeTab,
  Badge: LiveCodeBadge,
  CodeView: LiveCodeCodeView,
  PreviewView: LiveCodePreviewView,
  ConsoleView: LiveCodeConsoleView,
  EditButton: LiveCodeEditButton,
};

// Export types
/**
 * Type exports for LiveCode components
 */
export type {
  LiveCodeProps,
  LiveCodeTab,
  LiveCodeState,
  LiveCodeActions,
  LiveCodeContextValue,
} from "./types";

// Export Provider and Context for advanced use cases
/**
 * Provider export for custom LiveCode implementations
 */
export { LiveCodeProvider } from "./LiveCodeProvider";

/**
 * Hook export for accessing LiveCode context
 */
export { useLiveCodeContext } from "./useLiveCodeContext";

// Default export - Complete LiveCode component with all parts
/**
 * Complete LiveCode component with default configuration
 *
 * Provides a full-featured code playground with three tabs:
 * - Code: Syntax-highlighted source view
 * - Preview: Live rendered output
 * - Console: Runtime console output
 *
 * @param code - The source code to display and execute
 * @param language - The programming language (ts or tsx)
 * @param templates - Optional template files for the sandbox
 * @returns JSX element containing the complete LiveCode interface
 */
export default function LiveCodeComponent({
  code,
  language,
  templates,
}: LiveCodeProps) {
  return (
    <LiveCode.Provider code={code} language={language} templates={templates}>
      <LiveCodeSandpackProvider>
        <LiveCode.Frame>
          <LiveCode.Header>
            <LiveCode.Tabs>
              <LiveCode.Tab
                tab="code"
                label="Code"
                icon={<Code className="h-4 w-4" />}
              />
              <LiveCode.Tab
                tab="preview"
                label="Preview"
                icon={<Eye className="h-4 w-4" />}
              />
              <LiveCode.Tab
                tab="console"
                label="Console"
                icon={<Terminal className="h-4 w-4" />}
              />
            </LiveCode.Tabs>
            <div className="flex items-center">
              <LiveCode.Badge />
              <LiveCode.EditButton />
            </div>
          </LiveCode.Header>

          <LiveCode.CodeView />
          <LiveCode.PreviewView />
          <LiveCode.ConsoleView />
        </LiveCode.Frame>
      </LiveCodeSandpackProvider>
    </LiveCode.Provider>
  );
}
