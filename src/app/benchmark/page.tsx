/**
 * @module app/benchmark/page
 * @description Benchmark page component for the Taffy Layout documentation site.
 * Provides performance comparison between Taffy and Yoga layout engines.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Zap, AlertCircle, Activity, Square } from "lucide-react";
import {
  benchmarkCases,
  type BenchmarkResult,
  type TaffyContext,
  type YogaContext,
} from "@/features/benchmark/lib/benchmark";
import { loadTaffy } from "taffy-layout";
import SiteHeader from "@/components/layouts/SiteHeader";
import SiteFooter from "@/components/layouts/SiteFooter";
import PageTransition from "@/features/docs/components/PageTransition";
import { usePathname } from "next/navigation";
import {
  getUi,
  isLocale,
  localeBasePath,
  type Locale,
  DEFAULT_LOCALE,
} from "@/lib/locales";

/**
 * Duration for each benchmark test case in milliseconds.
 */
const TEST_DURATION = 10000; // 10 seconds per case

/**
 * Maximum number of iterations for each benchmark test case.
 */
const MAX_ITERATIONS = 100;

/**
 * Benchmark content component that renders the interactive benchmark interface.
 * @param locale - Optional locale for the benchmark page.
 * @returns The rendered benchmark content.
 */
export function BenchmarkContent({ locale: propLocale }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const possibleLocale = segments[0];
  const derivedLocale: Locale = isLocale(possibleLocale)
    ? possibleLocale
    : DEFAULT_LOCALE;
  const locale: Locale = propLocale || derivedLocale;
  const ui = getUi(locale);
  const [results, setResults] = useState<BenchmarkResult[]>(
    benchmarkCases.map((c) => ({
      name: c.name,
      taffyBuildTime: 0,
      taffyLayoutTime: 0,
      yogaBuildTime: 0,
      yogaLayoutTime: 0,
      status: "pending",
      progress: 0,
    })),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [taffyLoaded, setTaffyLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    async function init() {
      try {
        await loadTaffy();
        setTaffyLoaded(true);
      } catch (err) {
        console.warn("Default loadTaffy failed, trying fallback...", err);
        try {
          const taffyModule = await import("taffy-layout");
          const initWasm = taffyModule.default;
          await initWasm();
          setTaffyLoaded(true);
        } catch (err2) {
          console.error("Failed to load Taffy WASM:", err2);
          setError("Failed to initialize Taffy Layout engine (WASM).");
        }
      }
    }
    init();
  }, []);

  // Stop benchmark on unmount
  useEffect(() => {
    return () => {
      stopRef.current = true;
    };
  }, []);

  const runBenchmarks = async () => {
    if (isRunning) {
      stopRef.current = true;
      return;
    }

    if (!taffyLoaded) return;
    setIsRunning(true);
    setIsRunning(true);
    stopRef.current = false;
    setError(null);

    const initialResults = benchmarkCases.map((c) => ({
      name: c.name,
      taffyBuildTime: 0,
      taffyLayoutTime: 0,
      yogaBuildTime: 0,
      yogaLayoutTime: 0,
      status: "pending" as const,
      progress: 0,
    }));
    setResults(initialResults);

    for (let i = 0; i < benchmarkCases.length; i++) {
      if (stopRef.current) break;
      const bCase = benchmarkCases[i];
      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: "running" as const } : r,
        ),
      );

      const caseStartTime = performance.now();
      let iterationCount = 0;
      let tBuildTotal = 0,
        tLayoutTotal = 0;
      let yBuildTotal = 0,
        yLayoutTotal = 0;

      try {
        while (
          performance.now() - caseStartTime < TEST_DURATION &&
          iterationCount < MAX_ITERATIONS
        ) {
          if (stopRef.current) break;

          // Taffy Round
          let tBuildCtx: TaffyContext | null = bCase.taffy.build();
          const tLayoutTime = bCase.taffy.layout(tBuildCtx);
          const tBuildTime = tBuildCtx.time;
          bCase.taffy.cleanup(tBuildCtx);
          tBuildCtx = null; // Help GC

          tBuildTotal += tBuildTime;
          tLayoutTotal += tLayoutTime;

          // Yoga Round
          let yBuildCtx: YogaContext | null = bCase.yoga.build();
          const yLayoutTime = bCase.yoga.layout(yBuildCtx);
          const yBuildTime = yBuildCtx.time;
          bCase.yoga.cleanup(yBuildCtx);
          yBuildCtx = null; // Help GC

          yBuildTotal += yBuildTime;
          yLayoutTotal += yLayoutTime;

          iterationCount++;

          // Progress based on time or iterations, whichever is the bottleneck
          const timeProgress =
            (performance.now() - caseStartTime) / TEST_DURATION;
          const iterProgress = iterationCount / MAX_ITERATIONS;
          const progress = Math.max(timeProgress, iterProgress) * 100;

          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? {
                    ...r,
                    progress: Math.min(progress, 100),
                    taffyBuildTime: tBuildTotal / iterationCount,
                    taffyLayoutTime: tLayoutTotal / iterationCount,
                    yogaBuildTime: yBuildTotal / iterationCount,
                    yogaLayoutTime: yLayoutTotal / iterationCount,
                    currentTaffyBuild: tBuildTime,
                    currentTaffyLayout: tLayoutTime,
                    currentYogaBuild: yBuildTime,
                    currentYogaLayout: yLayoutTime,
                  }
                : r,
            ),
          );

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        if (stopRef.current) {
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i ? { ...r, status: "completed" as const } : r,
            ),
          );
        } else {
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? { ...r, status: "completed" as const, progress: 100 }
                : r,
            ),
          );
        }
      } catch (err) {
        console.error(`Benchmark ${bCase.name} failed:`, err);
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error" as const } : r,
          ),
        );
        setError(
          `Error running benchmark "${bCase.name}": ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        break;
      }
    }

    setIsRunning(false);
  };

  const basePath = localeBasePath(locale);
  const navGroups = [
    { key: "docs", title: ui.docs, href: `${basePath}/docs` },
    { key: "api", title: ui.api, href: `${basePath}/docs/api` },
    { key: "benchmark", title: ui.benchmark, href: `${basePath}/benchmark` },
    { key: "playground", title: ui.playground, href: `${basePath}/playground` },
  ];

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-slate-950 dark:text-slate-50"
      data-pagefind-filter={locale === DEFAULT_LOCALE ? "lang:en" : undefined}
    >
      <SiteHeader
        locale={locale}
        navGroups={navGroups}
        activeGroup="benchmark"
      />
      <PageTransition>
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 px-8 py-6 lg:flex-row lg:items-center">
            <div>
              <h1 className="mb-2 text-4xl font-black text-slate-900 dark:text-slate-50">
                {ui.fullBenchmarkSuite}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={runBenchmarks}
                disabled={!taffyLoaded}
                className={`flex items-center gap-2 rounded-full px-8 py-3 font-bold shadow-lg transition-all ${
                  isRunning
                    ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600"
                    : "bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600"
                } ${!taffyLoaded ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {isRunning ? (
                  <Square size={18} fill="currentColor" />
                ) : (
                  <Play size={18} />
                )}
                {isRunning ? ui.stop : ui.run}
              </button>
            </div>
          </div>
          {error && (
            <div className="px-8 pb-6">
              <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <div className="flex flex-row items-center gap-3 font-bold text-red-700">
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="px-8 pt-6 pb-8">
            <div className="overflow-visible rounded-lg border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table
                    aria-label="Phase comparison benchmark table"
                    className="mt-0 w-full"
                  >
                    <thead>
                      <tr>
                        <th className="border-r border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                          {ui.scenario}
                        </th>
                        <th className="border-r border-slate-100 bg-blue-50/30 px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-blue-900/20 dark:text-slate-100">
                          {ui.buildPhase}
                        </th>
                        <th className="border-r border-slate-100 bg-indigo-50/20 px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-indigo-900/20 dark:text-slate-100">
                          {ui.layoutPhase}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, idx) => {
                        const buildRatio = r.yogaBuildTime / r.taffyBuildTime;
                        const layoutRatio =
                          r.yogaLayoutTime / r.taffyLayoutTime;

                        return (
                          <tr
                            key={idx}
                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                          >
                            <td className="border-r border-slate-100 px-4 py-2 dark:border-slate-700">
                              <div className="py-2">
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                                  {(() => {
                                    const bCase = benchmarkCases[idx];
                                    const nameKey = bCase.nameKey;
                                    const count = bCase.count;
                                    if (
                                      nameKey &&
                                      count &&
                                      ui[nameKey as keyof typeof ui]
                                    ) {
                                      return String(
                                        ui[nameKey as keyof typeof ui],
                                      ).replace(
                                        "{{count}}",
                                        count.toLocaleString(),
                                      );
                                    }
                                    return r.name;
                                  })()}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                  {r.status === "running" && (
                                    <Activity
                                      size={10}
                                      className="text-primary animate-pulse"
                                    />
                                  )}
                                </div>
                                <div className="mt-2 h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      r.status === "completed"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{ width: `${r.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="border-r border-slate-100 px-4 py-2 dark:border-slate-700">
                              {r.status === "running" ||
                              r.status === "completed" ? (
                                <div className="flex flex-col gap-1.5 py-1">
                                  <div className="flex flex-col gap-3">
                                    <div
                                      className={`flex flex-col ${buildRatio < 1 ? "opacity-60" : ""}`}
                                    >
                                      <div className="mb-0.5 flex items-baseline justify-between">
                                        <span
                                          className={`text-[8px] font-black tracking-tighter uppercase ${buildRatio >= 1 ? "text-blue-500" : "text-slate-400"}`}
                                        >
                                          Taffy
                                        </span>
                                        <span
                                          className={`text-[11px] font-black ${buildRatio >= 1 ? "text-blue-700" : "text-slate-800"}`}
                                        >
                                          {r.taffyBuildTime.toFixed(3)}ms
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <div
                                          className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
                                          style={{
                                            width: `${buildRatio >= 1 ? 100 : buildRatio * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div
                                      className={`flex flex-col ${buildRatio >= 1 ? "opacity-60" : ""}`}
                                    >
                                      <div className="mb-0.5 flex items-baseline justify-between">
                                        <span
                                          className={`text-[8px] font-black tracking-tighter uppercase ${buildRatio < 1 ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
                                        >
                                          Yoga
                                        </span>
                                        <span
                                          className={`text-[11px] font-black ${buildRatio < 1 ? "text-slate-900 dark:text-slate-100" : "text-slate-800 dark:text-slate-300"}`}
                                        >
                                          {r.yogaBuildTime.toFixed(3)}ms
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                                        <div
                                          className="h-full rounded-full bg-slate-500 dark:bg-slate-400"
                                          style={{
                                            width: `${buildRatio < 1 ? 100 : (1 / buildRatio) * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold tracking-widest text-slate-200 uppercase dark:text-slate-700">
                                  {ui.pending}
                                </span>
                              )}
                              {!isNaN(buildRatio) && (
                                <div className="mt-0.5 flex items-center gap-1">
                                  <Zap
                                    size={10}
                                    className={
                                      buildRatio >= 1
                                        ? "fill-green-500 text-green-500"
                                        : "fill-slate-400 text-slate-400"
                                    }
                                  />
                                  <span
                                    className={`text-[10px] font-black tracking-tighter lowercase ${buildRatio >= 1 ? "text-green-500" : "text-slate-500"}`}
                                  >
                                    {buildRatio >= 1
                                      ? `${buildRatio.toFixed(1)}x ${ui.faster}`
                                      : `${(1 / buildRatio).toFixed(1)}x ${ui.slower}`}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="border-r border-slate-100 px-4 py-2 dark:border-slate-700">
                              {r.status === "running" ||
                              r.status === "completed" ? (
                                <div className="flex flex-col gap-1.5 py-1">
                                  <div className="flex flex-col gap-3">
                                    <div
                                      className={`flex flex-col ${layoutRatio < 1 ? "opacity-60" : ""}`}
                                    >
                                      <div className="mb-0.5 flex items-baseline justify-between">
                                        <span
                                          className={`text-[8px] font-black tracking-tighter uppercase ${layoutRatio >= 1 ? "text-primary" : "text-slate-400"}`}
                                        >
                                          Taffy
                                        </span>
                                        <span
                                          className={`text-[11px] font-black ${layoutRatio >= 1 ? "text-primary" : "text-slate-800"}`}
                                        >
                                          {r.taffyLayoutTime.toFixed(3)}ms
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                        <div
                                          className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
                                          style={{
                                            width: `${layoutRatio >= 1 ? 100 : layoutRatio * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div
                                      className={`flex flex-col ${layoutRatio >= 1 ? "opacity-60" : ""}`}
                                    >
                                      <div className="mb-0.5 flex items-baseline justify-between">
                                        <span
                                          className={`text-[8px] font-black tracking-tighter uppercase ${layoutRatio < 1 ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
                                        >
                                          Yoga
                                        </span>
                                        <span
                                          className={`text-[11px] font-black ${layoutRatio < 1 ? "text-slate-900 dark:text-slate-100" : "text-slate-800 dark:text-slate-300"}`}
                                        >
                                          {r.yogaLayoutTime.toFixed(3)}ms
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                                        <div
                                          className="h-full rounded-full bg-slate-500 dark:bg-slate-400"
                                          style={{
                                            width: `${layoutRatio < 1 ? 100 : (1 / layoutRatio) * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold tracking-widest text-slate-200 uppercase dark:text-slate-700">
                                  {ui.pending}
                                </span>
                              )}
                              {!isNaN(layoutRatio) && (
                                <div className="mt-0.5 flex items-center gap-1">
                                  <Zap
                                    size={10}
                                    className={
                                      layoutRatio >= 1
                                        ? "text-primary fill-primary"
                                        : "fill-slate-400 text-slate-400"
                                    }
                                  />
                                  <span
                                    className={`text-[10px] font-black tracking-tighter lowercase ${layoutRatio >= 1 ? "text-primary" : "text-slate-500"}`}
                                  >
                                    {layoutRatio >= 1
                                      ? `${layoutRatio.toFixed(1)}x ${ui.faster}`
                                      : `${(1 / layoutRatio).toFixed(1)}x ${ui.slower}`}
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}

export default function Page() {
  return <BenchmarkContent />;
}
