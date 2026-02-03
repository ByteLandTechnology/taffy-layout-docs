/**
 * @module features/home/components/EntryPoints
 * @description Component that renders the main navigation entry points for the home page.
 * Displays a grid of cards linking to Docs, API, Benchmark, and Playground sections.
 */

import Link from "next/link";
import { type UiStrings, type Locale, localeBasePath } from "@/lib/locales";
import { ICONS } from "@/features/code/lib/icons";

/**
 * Props for the entry points section.
 */
interface EntryPointsProps {
  /** Localized UI strings for labels and descriptions. */
  ui: UiStrings;
  /** Current locale for locale-aware routes. */
  locale: Locale;
}

/**
 * Entry points section linking to key areas of the site.
 * @module features/home/components/EntryPoints
 * @param props - Entry point data and localization props.
 * @returns Entry points section JSX.
 */
export function EntryPoints({ ui, locale }: EntryPointsProps) {
  const docsBase = `${localeBasePath(locale)}/docs`;

  /**
   * Static entry point definitions mapped to localized labels.
   */
  const overviewLinks = [
    {
      title: ui.docs,
      description: ui.docsDesc,
      href: docsBase,
      icon: ICONS.docs,
    },
    {
      title: ui.api,
      description: ui.apiDesc,
      href: `${docsBase}/api`,
      icon: ICONS.api,
    },
    {
      title: ui.benchmark,
      description: ui.benchmarkDesc,
      href: `${localeBasePath(locale)}/benchmark`,
      icon: ICONS.benchmark,
    },
    {
      title: ui.playground,
      description: ui.playgroundDesc,
      href: `${localeBasePath(locale)}/playground`,
      icon: ICONS.playground,
    },
  ];

  return (
    <section className="relative py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {ui.entryPoints}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {overviewLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-800">
                  <Icon size={22} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {link.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {link.description}
                </p>
                <div className="mt-6 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {ui.open} →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
