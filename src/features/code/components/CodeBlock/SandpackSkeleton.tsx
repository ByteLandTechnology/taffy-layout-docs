/**
 * @module features/code/components/CodeBlock/SandpackSkeleton
 * @description Loading state component for Sandpack instances.
 */

/**
 * Renders a placeholder skeleton while the Sandpack environment is initializing.
 * Matches the dimensions and styling of the live code editor.
 * @returns The skeleton JSX.
 */
export function SandpackSkeleton() {
  return (
    <div className="flex h-[400px] w-full animate-pulse flex-col items-center justify-center rounded-b-2xl bg-slate-100/50 dark:bg-slate-800/50">
      <div className="font-medium text-slate-400 dark:text-slate-500">
        Loading Preview…
      </div>
    </div>
  );
}
