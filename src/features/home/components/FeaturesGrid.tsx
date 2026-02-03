/**
 * @module features/home/components/FeaturesGrid
 * @description Component that renders the feature highlights grid for the home page.
 * Displays key features of the Taffy layout engine with icons and descriptions.
 */

import { ICONS } from "@/features/code/lib/icons";
import { type Feature } from "./types";
import { type UiStrings } from "@/lib/locales";

/**
 * Props for the features grid section.
 */
interface FeaturesGridProps {
  /** Optional list of feature data to display. */
  features?: Feature[];
  /** Localized UI strings for headings. */
  ui: UiStrings;
}

/**
 * Feature highlights grid for the home page.
 * @module features/home/components/FeaturesGrid
 * @param props - Feature list and localized UI strings.
 * @returns Feature grid JSX.
 */
export function FeaturesGrid({ features, ui }: FeaturesGridProps) {
  return (
    <section className="relative py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {ui.whyTaffy}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {(features || []).map((feature, idx) => {
            const Icon = [ICONS.zap, ICONS.grid, ICONS.badge, ICONS.monitor][
              idx % 4
            ];
            const colors = [
              "text-blue-500",
              "text-green-500",
              "text-red-500",
              "text-purple-500",
            ];

            return (
              <div
                key={idx}
                className="group border border-slate-200 bg-white/60 p-2 shadow-sm backdrop-blur-md transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex flex-col items-start px-6 pt-6 pb-2">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800">
                    <Icon className={colors[idx % 4]} size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
