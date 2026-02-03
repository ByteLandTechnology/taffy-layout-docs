/**
 * @module errors
 * @description Error handling utilities and custom error classes for the codebase.
 * Provides standardized error types for documentation processing and include directive failures,
 * along with a unified error reporting function for consistent logging across the application.
 *
 * @example
 * ```ts
 * import { DocProcessingError, reportError } from './errors';
 *
 * throw new DocProcessingError('Failed to parse', '/path/to/file.md');
 * // or
 * reportError(error, 'DocLoader');
 * ```
 */

/**
 * Base error class for documentation processing operations.
 * Captures the file path where the error occurred and any underlying cause.
 *
 * @example
 * ```ts
 * throw new DocProcessingError(
 *   'Failed to parse frontmatter',
 *   '/docs/guide.md',
 *   originalError
 * );
 * ```
 */
export class DocProcessingError extends Error {
  /**
   * Creates a new DocProcessingError instance.
   *
   * @param message - Human-readable error description
   * @param filePath - Absolute or relative path to the file being processed
   * @param cause - Optional underlying error that caused this error
   */
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "DocProcessingError";
  }
}

/**
 * Error thrown when an include directive fails to resolve or process.
 * Captures the include path, source file, and any underlying cause for debugging.
 *
 * @example
 * ```ts
 * throw new IncludeDirectiveError(
 *   './missing-file.md',
 *   '/docs/index.md',
 *   fileNotFoundError
 * );
 * ```
 */
export class IncludeDirectiveError extends Error {
  /**
   * Creates a new IncludeDirectiveError instance.
   *
   * @param includePath - The path specified in the include directive
   * @param sourceFile - The file containing the include directive
   * @param cause - Optional underlying error that caused the include to fail
   */
  constructor(
    public readonly includePath: string,
    public readonly sourceFile: string,
    cause?: unknown,
  ) {
    super(`Failed to include: ${includePath} from ${sourceFile}`);
    this.name = "IncludeDirectiveError";
    this.cause = cause;
  }
}

/**
 * Standardized error reporting function for consistent logging across the application.
 * Outputs errors to the console with context information.
 *
 * **Note:** This function is designed as an integration point for monitoring services
 * like Sentry. You can extend this function to send errors to external services.
 *
 * @param error - The error object or unknown value to report
 * @param context - Context description for identifying where the error occurred (e.g., 'DocLoader')
 *
 * @example
 * ```ts
 * try {
 *   await loadDocument(path);
 * } catch (error) {
 *   reportError(error, 'DocLoader');
 * }
 * ```
 */
export function reportError(error: Error | unknown, context: string): void {
  console.error(`[${context}]`, error);
  // Integration point for monitoring services (Sentry, etc.)
}
