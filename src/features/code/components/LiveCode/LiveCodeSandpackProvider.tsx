/**
 * @module features/code/components/LiveCode/LiveCodeSandpackProvider
 * @description Provider component that configures and initializes the Sandpack environment.
 * Handles cryptographic polyfills, dependency configuration, and file setup for the sandbox.
 */

"use client";

import { type ReactNode } from "react";
import {
  SandpackProvider,
  type SandpackFiles,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { useLiveCodeContext } from "./useLiveCodeContext";
import { LiveCodeFullScreenEditor } from "./parts";
import SandpackLoadListener from "./SandpackLoadListener";
import { buildSandpackFiles } from "@/features/docs/lib/sandpack-utils";
import { sha1 } from "@noble/hashes/legacy.js";
import { sha256, sha384, sha512 } from "@noble/hashes/sha2.js";

type DigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * Converts a BufferSource (ArrayBuffer or ArrayBufferView) to a Uint8Array.
 * @param data - The buffer source to convert.
 * @returns A Uint8Array view of the data.
 */
function toUint8Array(data: BufferSource) {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
  return new Uint8Array();
}

/**
 * Applies a partial polyfill for the Web Crypto API.
 * Adds support for `crypto.subtle.digest` and `crypto.getRandomValues` if missing,
 * using Node.js compatible implementations or fallbacks.
 */
function applyCryptoPolyfill() {
  const subtle = {
    digest: async (algorithm: AlgorithmIdentifier, data: BufferSource) => {
      const name =
        typeof algorithm === "string"
          ? algorithm
          : (algorithm as { name?: string })?.name || "";
      const normalized = name.toUpperCase() as DigestAlgorithm;
      const bytes = toUint8Array(data);
      let hash: Uint8Array;

      switch (normalized) {
        case "SHA-1":
          hash = sha1(bytes);
          break;
        case "SHA-384":
          hash = sha384(bytes);
          break;
        case "SHA-512":
          hash = sha512(bytes);
          break;
        case "SHA-256":
        default:
          hash = sha256(bytes);
          break;
      }

      return hash.buffer.slice(
        hash.byteOffset,
        hash.byteOffset + hash.byteLength,
      );
    },
  };

  /**
   * Fallback implementation for getRandomValues using Math.random.
   * Note: This is not cryptographically secure but sufficient for non-critical generation.
   * @param array - The array to fill with random values.
   * @returns The filled array.
   */
  const fallbackGetRandomValues = (array: Uint8Array) => {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };

  const existing = globalThis.crypto as Crypto | undefined;

  if (!existing) {
    try {
      Object.defineProperty(globalThis, "crypto", {
        value: { subtle, getRandomValues: fallbackGetRandomValues },
        configurable: true,
      });
    } catch {
      // Ignore if it can't be defined in this environment
    }
    return;
  }

  if (!existing.subtle || !(existing.subtle as SubtleCrypto).digest) {
    try {
      Object.defineProperty(existing, "subtle", {
        value: subtle,
        configurable: true,
      });
    } catch {
      try {
        (existing as unknown as { subtle: SubtleCrypto }).subtle =
          subtle as SubtleCrypto;
      } catch {
        // Ignore if read-only
      }
    }
  }

  if (!existing.getRandomValues) {
    try {
      Object.defineProperty(existing, "getRandomValues", {
        value: fallbackGetRandomValues,
        configurable: true,
      });
    } catch {
      try {
        (
          existing as unknown as {
            getRandomValues: typeof fallbackGetRandomValues;
          }
        ).getRandomValues = fallbackGetRandomValues;
      } catch {
        // Ignore if read-only
      }
    }
  }
}

applyCryptoPolyfill();

interface LiveCodeSandpackProviderProps {
  children: ReactNode;
}

/**
 * Sandpack provider wrapper for LiveCode.
 *
 * Configures the Sandpack environment with the necessary settings:
 * - Selects the appropriate template (vanilla-ts or react-ts)
 * - Sets up dependencies (including taffy-layout)
 * - Polyfills crypto functions for the browser environment
 * - Manages the file system within the sandbox
 *
 * @param props.children - Child components to be wrapped by the SandpackProvider.
 * @returns The configured SandpackProvider component.
 */
export function LiveCodeSandpackProvider({
  children,
}: LiveCodeSandpackProviderProps) {
  const { meta, actions } = useLiveCodeContext();
  const { resolvedTheme } = useTheme();
  const isTsx = meta.language === "tsx";

  // Build files from code using shared utility
  const sandpackFiles = buildSandpackFiles(
    meta.code,
    meta.language,
    meta.templates,
    resolvedTheme === "dark" ? "dark" : "light",
  );

  // Add package.json which is not handled by the utility
  const files: SandpackFiles = {
    ...sandpackFiles,
    "package.json": {
      code: getDefaultPackageJson(isTsx),
      hidden: true,
      readOnly: true,
    },
  };

  return (
    <SandpackProvider
      template={isTsx ? "react-ts" : "vanilla-ts"}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      customSetup={{
        dependencies: {
          "taffy-layout": "latest",
          "@noble/hashes": "^2.0.1",
        },
      }}
      files={files}
      options={{
        autorun: true,
        // Remove visibleFiles restriction to let 'hidden' property work
        // visibleFiles: Object.keys(files),
        activeFile: isTsx ? "App.tsx" : "index.ts",
        recompileMode: "delayed",
        recompileDelay: 700,
      }}
    >
      <SandpackLoadListener onReady={() => actions.setSandpackReady(true)} />
      {children}
      <LiveCodeFullScreenEditor />
    </SandpackProvider>
  );
}

/**
 * Generates the content for package.json.
 *
 * @param isReact - Whether to include React dependencies.
 * @returns A JSON string representing the package.json file.
 */
function getDefaultPackageJson(isReact: boolean): string {
  return JSON.stringify(
    {
      name: "taffy-sandbox",
      version: "1.0.0",
      dependencies: {
        "taffy-layout": "latest",
        "@noble/hashes": "^2.0.1",
        ...(isReact
          ? {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
            }
          : {}),
      },
    },
    null,
    2,
  );
}
