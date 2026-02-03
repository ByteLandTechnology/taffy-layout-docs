/**
 * @module features/code/lib/sandpack-assets/ts-index
 * @description Entry point for the Vanilla TypeScript Sandpack environment.
 * Waits for the environment to be ready and then executes the user's code.
 */

import { ready } from "./sandbox-setup";
ready.then(() => {
  // {{CODE}} - This placeholder is replaced at runtime with the user's TypeScript code.
});
