/**
 * @module SandpackLoadListener
 * @description A utility component to listen for Sandpack load events.
 */

"use client";

import { useSandpack } from "@codesandbox/sandpack-react";
import { useEffect } from "react";

/**
 * Listens for the Sandpack bundler status.
 *
 * Calls the `onReady` callback when the Sandpack status becomes "running",
 * indicating that the bundler has finished and the preview is ready.
 *
 * @param props.onReady - Callback function invoked when Sandpack is ready.
 * @returns Null, as this component does not render anything.
 */
export default function SandpackLoadListener({
  onReady,
}: {
  onReady: () => void;
}) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    // Determine readiness based on sandpack status
    // 'running' usually means the bundler has finished processing and is serving
    if (sandpack.status === "running") {
      onReady();
    }
  }, [sandpack.status, onReady]);

  return null;
}
