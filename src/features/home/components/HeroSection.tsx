/**
 * @module features/home/components/HeroSection
 * @description Hero section component for the landing page.
 * Features an animated headline, tagline, highlight bullets, and a visual element.
 */

"use client";

import { type UiStrings } from "@/lib/locales";
import { type HeroData } from "@/features/home/components/types";
import HeroVisual from "@/features/home/components/HeroVisual";
import { motion } from "framer-motion";

/**
 * Props for the hero section component.
 */
interface HeroSectionProps {
  /** Optional hero content override. */
  hero?: HeroData;
  /** Localized UI strings. */
  ui: UiStrings;
  /** Highlight bullets shown under the hero copy. */
  highlights: string[];
}

/**
 * Home page hero section with animated headline and highlights.
 * @module features/home/components/HeroSection
 * @param props - Hero content and highlight data.
 * @returns Hero section JSX.
 */
export function HeroSection({ hero, ui, highlights }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="w-full text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-100">
              <span className="text-gradient-tri">
                {hero?.name || "Taffy Layout"}
              </span>
              <span className="mt-3 block text-2xl leading-tight text-slate-700 sm:text-4xl dark:text-slate-300">
                {hero?.text || "The High-Performance Layout Engine"}
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-slate-600 lg:mx-0 dark:text-slate-400">
              {hero?.tagline || ui.heroDescription}
            </p>
            <ul className="mx-auto grid max-w-xl gap-3 text-sm text-slate-600 lg:mx-0 dark:text-slate-400">
              {highlights.map((line, index) => (
                <li
                  key={line}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-left dark:border-slate-800/60 dark:bg-slate-900/80"
                >
                  <span
                    className={`mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                      index === 0
                        ? "bg-rgb-blue dark:bg-rgb-blue"
                        : index === 1
                          ? "bg-rgb-green dark:bg-rgb-green"
                          : "bg-rgb-red dark:bg-rgb-red"
                    }`}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative flex w-full items-center justify-center p-4 lg:h-auto lg:p-0"
          >
            <HeroVisual />

            <div className="bg-gradient-radial pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 from-violet-500/10 to-transparent blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
