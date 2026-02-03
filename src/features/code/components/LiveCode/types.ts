/**
 * @module features/code/components/LiveCode/types
 * @description Type definitions for LiveCode component and related state management
 *
 * Provides comprehensive type definitions for live code execution, including
 * tab management, state tracking, Sandpack integration, and context providers.
 * Used for interactive code playgrounds in the documentation.
 */

import type { ReactNode } from "react";

/**
 * Available tabs in the LiveCode component
 * - "code": Source code editor view
 * - "preview": Live preview of the rendered component
 * - "console": Browser console output
 */
export type LiveCodeTab = "code" | "preview" | "console";

/**
 * State management interface for LiveCode component
 * @interface LiveCodeState
 */
export interface LiveCodeState {
  /** Currently active tab */
  tab: LiveCodeTab;
  /** Whether Sandpack should be rendered (lazy loading optimization) */
  shouldRenderSandpack: boolean;
  /** Whether Sandpack has finished initializing */
  sandpackReady: boolean;
  /** Whether the code editor is in fullscreen mode */
  isFullScreen: boolean;
}

/**
 * Actions interface for modifying LiveCode state
 * @interface LiveCodeActions
 */
export interface LiveCodeActions {
  /** Switch to a different tab */
  setTab: (tab: LiveCodeTab) => void;
  /** Mark Sandpack as initialized and ready */
  setSandpackReady: (ready: boolean) => void;
  /** Toggle fullscreen mode for the code editor */
  setFullScreen: (isFullScreen: boolean) => void;
}

/**
 * Metadata for live code execution
 * @interface LiveCodeMeta
 */
export interface LiveCodeMeta {
  /** Source code to execute */
  code: string;
  /** Programming language (TypeScript or TSX) */
  language: "ts" | "tsx";
  /** Template strings for code execution environment */
  templates?: {
    /** Helper functions for preview rendering */
    previewHelpers: string;
    /** Setup code for the environment */
    setup: string;
    /** React component index file content */
    reactIndex: string;
    /** TypeScript configuration content */
    tsIndex: string;
  };
}

/**
 * Context value for LiveCode component tree
 * @interface LiveCodeContextValue
 */
export interface LiveCodeContextValue {
  /** Current state of the LiveCode component */
  state: LiveCodeState;
  /** Actions to modify the state */
  actions: LiveCodeActions;
  /** Metadata for code execution */
  meta: LiveCodeMeta;
}

/**
 * Props for the LiveCode component
 * @interface LiveCodeProps
 */
export interface LiveCodeProps {
  /** Source code to display and execute */
  code: string;
  /** Programming language (TypeScript or TSX) */
  language: "ts" | "tsx";
  /** Template strings for code execution environment */
  templates?: {
    /** Helper functions for preview rendering */
    previewHelpers: string;
    /** Setup code for the environment */
    setup: string;
    /** React component index file content */
    reactIndex: string;
    /** TypeScript configuration content */
    tsIndex: string;
  };
}

/**
 * Props for the LiveCodeProvider component
 * @interface LiveCodeProviderProps
 */
export interface LiveCodeProviderProps {
  /** Child components to wrap with the context */
  children: ReactNode;
  /** Source code to execute */
  code: string;
  /** Programming language (TypeScript or TSX) */
  language: "ts" | "tsx";
  /** Template strings for code execution environment */
  templates?: {
    /** Helper functions for preview rendering */
    previewHelpers: string;
    /** Setup code for the environment */
    setup: string;
    /** React component index file content */
    reactIndex: string;
    /** TypeScript configuration content */
    tsIndex: string;
  };
}
