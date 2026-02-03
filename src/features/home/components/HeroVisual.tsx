/**
 * Animated hero visual showcasing layout transformations.
 * @module features/home/components/HeroVisual
 */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Brand colors used by the layout nodes.
 */
const COLORS = {
  blue: "#007AFF",
  green: "#34C759",
  red: "#FF3B30",
};

/**
 * Supported layout states for the animated hero visual.
 */
type LayoutType = "row" | "column" | "grid";

/**
 * Absolute positioning configuration for each layout state.
 * @remarks Values are chosen to ensure smooth interpolation between layouts.
 */
const LAYOUTS: Record<
  LayoutType,
  Record<
    "node1" | "node2" | "node3",
    {
      top: number | string;
      left: number | string;
      width: number | string;
      height: number | string;
      borderRadius?: number;
    }
  >
> = {
  grid: {
    node1: {
      top: "6%",
      left: "6%",
      width: "88%",
      height: "38%",
      borderRadius: 24,
    },
    node2: {
      top: "50%",
      left: "6%",
      width: "42%",
      height: "44%",
      borderRadius: 24,
    },
    node3: {
      top: "50%",
      left: "52%",
      width: "42%",
      height: "44%",
      borderRadius: 24,
    },
  },
  row: {
    node1: {
      top: "6%",
      left: "6%",
      width: "22%",
      height: "88%",
      borderRadius: 16,
    },
    node2: {
      top: "6%",
      left: "32%",
      width: "36%",
      height: "88%",
      borderRadius: 16,
    },
    node3: {
      top: "6%",
      left: "72%",
      width: "22%",
      height: "88%",
      borderRadius: 16,
    },
  },
  column: {
    node1: {
      top: "6%",
      left: "6%",
      width: "88%",
      height: "18%",
      borderRadius: 16,
    },
    node2: {
      top: "28%",
      left: "6%",
      width: "88%",
      height: "44%",
      borderRadius: 16,
    },
    node3: {
      top: "76%",
      left: "6%",
      width: "88%",
      height: "18%",
      borderRadius: 16,
    },
  },
};

/**
 * Render the animated hero visual for the home page.
 * @returns Hero visual JSX.
 */
export default function HeroVisual() {
  const [activeLayout, setActiveLayout] = useState<LayoutType>("grid");

  useEffect(() => {
    const states: LayoutType[] = ["grid", "row", "column"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      setActiveLayout(states[currentIndex]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="perspective-1000 group relative z-10 mx-auto w-full max-w-[600px] cursor-default select-none md:aspect-4/3 md:max-w-none">
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[40px] border border-white/80 bg-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-slate-700/80 dark:bg-slate-800/60 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute top-0 right-0 left-0 flex h-16 items-center justify-between border-b border-black/5 px-8 dark:border-white/10">
          <div className="flex gap-2 opacity-40">
            <div className="h-3 w-3 rounded-full bg-black dark:bg-white"></div>
            <div className="h-3 w-3 rounded-full bg-black dark:bg-white"></div>
          </div>

          <div className="relative flex rounded-full bg-black/5 px-1 py-1 dark:bg-white/10">
            <motion.div
              className="absolute top-1 bottom-1 w-[33%] rounded-full bg-white shadow-sm dark:bg-slate-600"
              initial={false}
              animate={{
                left:
                  activeLayout === "grid"
                    ? "2px"
                    : activeLayout === "row"
                      ? "33%"
                      : "66%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {["GRID", "ROW", "COL"].map((label) => {
              const stateKey =
                label === "COL"
                  ? "column"
                  : (label.toLowerCase() as LayoutType);
              const isActive = activeLayout === stateKey;

              return (
                <div
                  key={label}
                  className={`relative z-10 px-3 py-1.5 text-[9px] font-bold tracking-widest transition-colors duration-200 ${isActive ? "text-black dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute top-16 right-0 bottom-0 left-0">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-size-[24px_24px]"></div>

          <Node id="node1" activeLayout={activeLayout} color={COLORS.blue} />
          <Node id="node2" activeLayout={activeLayout} color={COLORS.green} />
          <Node id="node3" activeLayout={activeLayout} color={COLORS.red} />
        </div>
      </motion.div>

      <div className="absolute right-10 -bottom-10 left-10 -z-10 h-20 animate-pulse rounded-full bg-linear-to-r from-blue-500/20 via-green-500/20 to-red-500/20 blur-3xl"></div>
    </div>
  );
}

/**
 * Render a single animated layout node.
 * @param props - Node configuration for layout state and color.
 * @returns Animated node JSX.
 */
function Node({
  id,
  activeLayout,
  color,
}: {
  id: "node1" | "node2" | "node3";
  activeLayout: LayoutType;
  color: string;
}) {
  const config = LAYOUTS[activeLayout][id];

  return (
    <motion.div
      className="group/node absolute flex items-center justify-center overflow-hidden border border-white/20 shadow-lg backdrop-filter"
      initial={false}
      animate={{
        top: config.top,
        left: config.left,
        width: config.width,
        height: config.height,
        borderRadius: config.borderRadius,
      }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 18,
        mass: 1.2,
      }}
      style={{ backgroundColor: color }}
    >
      <div
        className={`absolute inset-0 rounded-xl bg-linear-to-r ${color} opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-30`}
      ></div>

      <motion.span
        className={`relative font-mono text-[10px] font-bold tracking-widest text-white uppercase opacity-0 transition-opacity group-hover/node:opacity-80`}
        layout
      ></motion.span>
    </motion.div>
  );
}
