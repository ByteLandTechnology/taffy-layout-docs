/**
 * @module features/code/hooks/useClipboard
 * @description Hook for handling clipboard copy functionality with success feedback
 *
 * Provides a wrapper around @heroui/use-clipboard with default timeout
 * and standardized API for copying text to clipboard with visual feedback.
 *
 * @example
 * ```tsx
 * function CopyButton({ text }: { text: string }) {
 *   const { copied, copy } = useClipboard({ timeout: 3000 });
 *
 *   return (
 *     <button onClick={() => copy(text)}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   );
 * }
 * ```
 */

import { useClipboard as useHeroClipboard } from "@heroui/use-clipboard";

/**
 * Configuration options for the useClipboard hook
 * @interface UseClipboardOptions
 */
export interface UseClipboardOptions {
  /**
   * Duration in milliseconds for the copied state to reset
   * @default 2000
   */
  timeout?: number;
}

/**
 * Return type for the useClipboard hook
 * @interface UseClipboardReturn
 */
export interface UseClipboardReturn {
  /**
   * Whether the content has been recently copied to clipboard
   * Will reset to false after the specified timeout
   */
  copied: boolean;
  /**
   * Function to copy text to clipboard
   * @param text - The text to copy to clipboard
   */
  copy: (text: string) => void;
}

/**
 * Hook to handle clipboard copy functionality with success feedback
 *
 * Wraps @heroui/use-clipboard to provide a consistent API for copying
 * text to clipboard with visual feedback via the `copied` state.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing `copied` state and `copy` function
 *
 * @example
 * ```tsx
 * const { copied, copy } = useClipboard({ timeout: 3000 });
 *
 * const handleCopy = () => {
 *   copy('Hello, World!');
 * };
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? 'Copied!' : 'Copy to Clipboard'}
 *   </button>
 * );
 * ```
 */
export function useClipboard(
  options?: UseClipboardOptions,
): UseClipboardReturn {
  const { copied, copy } = useHeroClipboard({
    timeout: options?.timeout ?? 2000,
  });

  return { copied, copy };
}
