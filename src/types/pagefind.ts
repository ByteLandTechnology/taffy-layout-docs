/**
 * Type definitions for the Pagefind client runtime.
 * @module types/pagefind
 * @description
 * Provides TypeScript types for the Pagefind search API and the global window
 * integration used by the documentation site search UI.
 */

/**
 * Search result reference returned by Pagefind.
 * @description
 * Results are returned as lightweight references; call {@link PagefindResult.data}
 * to resolve full content data.
 */
export interface PagefindResult {
  /** Stable result identifier. */
  id: string;
  /** Resolves the result payload when invoked. */
  data: () => Promise<{
    /** Canonical URL for the result. */
    url: string;
    /** Full searchable content. */
    content: string;
    /** Short excerpt for preview. */
    excerpt: string;
    /** Metadata for the result, such as title. */
    meta: { title: string };
  }>;
}

/**
 * Pagefind global API exposed by the runtime bundle.
 * @description
 * Provides search, configuration, and initialization methods for the site
 * search experience.
 */
export interface PagefindGlobal {
  /**
   * Execute a search query against the Pagefind index.
   * @param query - User-entered search string.
   * @param options - Optional filter and language settings.
   * @returns Search results with a list of result references.
   */
  search: (
    query: string,
    options?: { filters?: Record<string, unknown>; language?: string },
  ) => Promise<{ results: PagefindResult[] }>;
  /**
   * Configure client-side search behavior.
   * @param opts - Configuration settings.
   */
  options: (opts: { showSubResults: boolean }) => void;
  /**
   * Initialize the Pagefind runtime before running searches.
   * @returns Promise resolved when ready.
   */
  init: () => Promise<void>;
}

declare global {
  interface Window {
    /** Optional Pagefind runtime API when the bundle is loaded. */
    pagefind?: PagefindGlobal;
  }
}
