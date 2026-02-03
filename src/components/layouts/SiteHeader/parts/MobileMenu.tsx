import { forwardRef, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Github,
  BookOpen,
  Code2,
  Gauge,
  FlaskConical,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
  localeList,
  localeLabel,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/locales";
import type { MobileMenuProps } from "../types";

/**
 * Mobile navigation menu overlay.
 * @module components/layouts/SiteHeader/parts/MobileMenu
 * @param props - Menu props including navigation groups and close handler.
 * @param ref - Forwarded ref to the menu container for focus management.
 * @returns Mobile menu JSX.
 */
export const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ navGroups, activeGroup, ui, firstLinkRef, onClose }, ref) => {
    /**
     * Resolve a navigation group href for mobile links.
     */
    const mobileGroupHref = (group: { href: string }) => group.href || "#";
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname() || "/";
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    /**
     * Derive locale state from the current pathname.
     */
    const segments = pathname.split("/").filter(Boolean);
    const possibleLocale = segments[0];
    const currentLocale = localeList.includes(possibleLocale as Locale)
      ? (possibleLocale as Locale)
      : DEFAULT_LOCALE;
    const rest =
      currentLocale === DEFAULT_LOCALE ? segments : segments.slice(1);

    /**
     * Build a locale-aware path for language switcher links.
     */
    const getLocalePath = (locale: string) => {
      if (!rest.length) return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
      const suffix = rest.join("/");
      return locale === DEFAULT_LOCALE ? `/${suffix}` : `/${locale}/${suffix}`;
    };

    return (
      <div
        ref={ref}
        id="mobile-menu"
        className="absolute top-16 left-0 h-[calc(100vh-4rem)] w-full overflow-y-auto border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          {ui.navigation ?? "Navigation"}
        </h2>
        <div className="space-y-2 px-6 pt-6 pb-6">
          {navGroups.map((group, index) => {
            const Icon =
              {
                docs: BookOpen,
                api: Code2,
                benchmark: Gauge,
                playground: FlaskConical,
              }[group.key] ?? BookOpen;

            return (
              <NextLink
                key={group.key}
                ref={index === 0 ? firstLinkRef : null}
                href={mobileGroupHref(group)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 transition-colors ${
                  activeGroup === group.key
                    ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
                onClick={onClose}
              >
                <Icon
                  size={20}
                  className={
                    activeGroup === group.key
                      ? "text-primary"
                      : "text-slate-500 dark:text-slate-400"
                  }
                />
                <span className="text-base">{group.title}</span>
              </NextLink>
            );
          })}

          <NextLink
            href="https://github.com/ByteLandTechnology/taffy-layout"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl p-3 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            onClick={onClose}
          >
            <Github size={20} className="text-slate-500 dark:text-slate-400" />
            <span className="text-base font-medium">GitHub</span>
          </NextLink>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {theme === "dark" ? (
                <Moon
                  size={20}
                  className="text-slate-500 dark:text-slate-400"
                />
              ) : (
                <Sun size={20} className="text-slate-500 dark:text-slate-400" />
              )}
              <span className="text-base">{ui.themeToggle}</span>
            </button>
            <div>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Globe
                  size={20}
                  className="text-slate-500 dark:text-slate-400"
                />
                <span className="flex-1 text-base">{ui.langLabel}</span>
                {isLangMenuOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {isLangMenuOpen && (
                <div className="ml-9 space-y-1 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
                  {localeList.map((locale) => (
                    <NextLink
                      key={locale}
                      href={getLocalePath(locale)}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        locale === currentLocale
                          ? "text-primary font-semibold"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                      onClick={onClose}
                    >
                      {localeLabel(locale)}
                    </NextLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

MobileMenu.displayName = "MobileMenu";
