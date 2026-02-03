/**
 * @module LoadingSkeleton
 * @description Loading skeleton component for code blocks. Displays an animated
 * placeholder while code content is being loaded or processed.
 */

/**
 * Props for the LoadingSkeleton component
 * @property className - Additional CSS class names
 */
interface LoadingSkeletonProps {
  className?: string;
}

/**
 * Renders a loading skeleton placeholder for code blocks.
 * Displays animated pulsing bars to indicate content is loading.
 * @param props - The component props
 * @param props.className - Additional CSS class names
 * @returns A div element with animated loading bars
 */
export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-50 p-4 ${className || ""}`}
    >
      <div className="animate-pulse space-y-2">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
      </div>
    </div>
  );
}
