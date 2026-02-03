/**
 * @module Search
 * @description Documentation search component using Pagefind for client-side search functionality.
 * Provides a command palette-style search interface with keyboard shortcuts and localized results.
 */

"use client";

import {
  Input,
  Button,
  useDisclosure,
  Listbox,
  ListboxItem,
  Tooltip,
} from "@heroui/react";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePagefind } from "@/hooks/usePagefind";
import { getCurrentLocale, getUi } from "@/lib/locales";

/**
 * Search component for documentation site
 * @returns Search interface with button trigger and expandable search input
 */
export default function Search() {
  const locale = getCurrentLocale();
  const ui = getUi(locale);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const { results, isLoading, search, clearResults } = usePagefind(isOpen);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpen]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      search(value, { language: locale });
    }, 300);
  };

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
    setQuery("");
    clearResults();
  };

  const handleBlur = () => {
    if (!query) {
      onClose();
    }
  };

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {!isOpen ? (
        <Tooltip content={ui.searchTooltip} className="dark:text-slate-100">
          <Button
            isIconOnly
            variant="light"
            className="text-slate-500 transition-all duration-300 ease-in-out hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onPress={onOpen}
            aria-label={ui.searchDocumentation}
          >
            <SearchIcon size={20} />
          </Button>
        </Tooltip>
      ) : (
        <div className="animate-in fade-in zoom-in-95 relative duration-200 ease-out">
          <Input
            ref={inputRef}
            placeholder={ui.searchPlaceholder}
            value={query}
            onValueChange={handleSearch}
            onBlur={handleBlur}
            startContent={<SearchIcon className="text-slate-400" />}
            className="w-[200px] text-lg sm:w-80"
            classNames={{
              input:
                "text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500",
              inputWrapper:
                "shadow-none bg-transparent hover:bg-transparent focus-within:bg-transparent",
            }}
          />
          {results.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 w-80 rounded-lg border border-slate-200 bg-white shadow-lg duration-200 ease-out dark:border-slate-800 dark:bg-slate-900">
              <Listbox
                items={results}
                aria-label="Search results"
                onAction={(key) => handleSelect(key as string)}
                classNames={{
                  list: "gap-2",
                }}
              >
                {(item) => (
                  <ListboxItem
                    key={item.url}
                    className="cursor-pointer rounded-xl px-4 py-3 data-[hover=true]:bg-slate-100 dark:data-[hover=true]:bg-slate-800"
                    textValue={item.title}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </span>
                      <span
                        className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: item.excerpt }}
                      />
                    </div>
                  </ListboxItem>
                )}
              </Listbox>
            </div>
          )}
          {query && results.length === 0 && !isLoading && (
            <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 w-80 rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-lg duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
              {ui.noResultsFound} &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
