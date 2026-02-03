/**
 * @module features/code/lib/sandpack-assets/react-index
 * @description Entry point for the React Sandpack environment.
 * Initializes the React root and renders the user's App component.
 */

import { ready } from "./sandbox-setup";
import { createRoot } from "react-dom/client";
// @ts-expect-error -- Sandpack issue
import App from "./App";

ready.then(() => {
  // Mount the application once the sandbox environment is ready
  const root = document.getElementById("root");
  if (root) createRoot(root).render(<App />);
});
