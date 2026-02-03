"use client";

import type { ReactNode } from "react";

/**
 * A wrapper component for column transitions in the documentation layout.
 * Currently renders a simple div but allows for future animation enhancements.
 *
 * @param props.children - The content to be wrapped.
 * @param props.className - Optional CSS classes for the wrapper.
 */
export default function ColumnTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  motionKey?: string;
}) {
  return <div className={className || ""}>{children}</div>;
}
