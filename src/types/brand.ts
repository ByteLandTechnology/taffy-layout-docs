/**
 * Branded type utilities for stronger nominal typing.
 * @module types/brand
 * @description
 * Defines a lightweight branding pattern that keeps the runtime shape the same
 * while preventing accidental mixing of logically distinct string values.
 */

/**
 * Utility type to create a branded value.
 * @template T - Base type to brand.
 * @template B - Brand marker type.
 * @remarks
 * The brand only exists at compile time and does not change the runtime value.
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Branded type for documentation route paths.
 * @example
 * ```ts
 * const path: DocPath = "/docs/getting-started" as DocPath;
 * ```
 */
export type DocPath = Brand<string, "DocPath">;

/**
 * Branded type for locale codes.
 * @example
 * ```ts
 * const locale: LocaleCode = "en" as LocaleCode;
 * ```
 */
export type LocaleCode = Brand<string, "LocaleCode">;

/**
 * Cast a string to a {@link DocPath} when you have validated it elsewhere.
 * @param path - Raw path string.
 * @returns Branded document path value.
 * @remarks
 * This does not validate the input; it only narrows the type for callers.
 * Prefer constructing paths from known route segments.
 */
export function asDocPath(path: string): DocPath {
  return path as DocPath;
}

/**
 * Cast a string to a {@link LocaleCode} when it is already known valid.
 * @param locale - Raw locale string.
 * @returns Branded locale code value.
 * @remarks
 * This helper only performs a type assertion and should not be used for
 * untrusted inputs.
 */
export function asLocaleCode(locale: string): LocaleCode {
  return locale as LocaleCode;
}
