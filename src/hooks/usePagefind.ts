/**
 * Pagefind search hook for the documentation search modal.
 * @module hooks/usePagefind
 * @description
 * Lazily loads the Pagefind runtime when the search UI opens, then exposes a
 * search helper and normalized results for UI rendering.
 */

import { useState, useEffect } from "react";
import type { PagefindGlobal } from "@/types/pagefind";

/**
 * Manage Pagefind initialization and search state.
 * @param isOpen - Whether the search UI is currently open.
 * @returns Search results, loading state, and helper actions.
 */
export function usePagefind(isOpen: boolean) {
  const [results, setResults] = useState<
    { id: string; url: string; title: string; excerpt: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initPagefind = async () => {
      if (typeof window.pagefind === "undefined") {
        try {
          const { default: pagefind } = (await import(
            /* webpackIgnore: true */ "/_pagefind/pagefind.js"
          )) as { default: PagefindGlobal };
          window.pagefind = pagefind;
          await pagefind.init();
        } catch (error) {
          console.warn("Pagefind init failed", error);
        }
      }
    };
    if (isOpen) {
      initPagefind();
    }
  }, [isOpen]);

  /**
   * Execute a search and populate the results state.
   * @param query - User-entered search string.
   * @param options - Optional language filter.
   */
  const search = async (query: string, options?: { language?: string }) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (window.pagefind) {
      setIsLoading(true);
      try {
        const searchOptions = options?.language
          ? { filters: { lang: options.language } }
          : undefined;
        const search = await window.pagefind.search(query, searchOptions);
        const data = await Promise.all(
          search.results.slice(0, 5).map((r) => r.data()),
        );
        setResults(
          data.map((d) => ({
            id: d.url,
            url: d.url,
            title: d.meta.title,
            excerpt: d.excerpt,
          })),
        );
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Clear the current search results.
   */
  const clearResults = () => setResults([]);

  return { results, isLoading, search, clearResults };
}
