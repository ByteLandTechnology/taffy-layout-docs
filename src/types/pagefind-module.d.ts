/**
 * Module declarations for Pagefind runtime bundles.
 * @module types/pagefind-module
 * @description
 * Declares the generated Pagefind JavaScript bundles so they can be imported
 * using the paths produced during static builds.
 */

/**
 * Import path for Pagefind bundles emitted into nested output directories.
 */
declare module "*/_pagefind/pagefind.js" {
  type PagefindGlobal = import("./pagefind").PagefindGlobal;
  const pagefind: PagefindGlobal;
  export default pagefind;
}

/**
 * Import path for the root Pagefind bundle used in production builds.
 */
declare module "/_pagefind/pagefind.js" {
  type PagefindGlobal = import("./pagefind").PagefindGlobal;
  const pagefind: PagefindGlobal;
  export default pagefind;
}
