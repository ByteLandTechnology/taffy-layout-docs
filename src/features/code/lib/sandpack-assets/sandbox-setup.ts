/**
 * @module sandbox-setup
 * @description Initialization script for the Sandpack environment.
 * Sets up the Taffy layout engine and polyfills Web Crypto API if needed.
 */

import { registerPreview } from "./taffy-preview";

type DigestAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * Converts a BufferSource to a Uint8Array.
 *
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

const fallbackGetRandomValues = (array: Uint8Array) => {
  for (let i = 0; i < array.length; i += 1) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
};

const fallbackSubtle = {
  digest: async (algorithm: AlgorithmIdentifier, data: BufferSource) => {
    const name =
      typeof algorithm === "string"
        ? algorithm
        : (algorithm as { name?: string })?.name || "";
    const normalized = name.toUpperCase() as DigestAlgorithm;
    const bytes = toUint8Array(data);
    const { sha1 } = await import("@noble/hashes/legacy.js");
    const { sha256, sha384, sha512 } = await import("@noble/hashes/sha2.js");
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
 * Polyfills the Web Crypto API's digest and getRandomValues functions.
 * required for some dependencies within the sandbox.
 */
function applyCryptoPolyfill() {
  const existing = globalThis.crypto as Crypto | undefined;

  if (!existing) {
    try {
      Object.defineProperty(globalThis, "crypto", {
        value: {
          subtle: fallbackSubtle,
          getRandomValues: fallbackGetRandomValues,
        },
        configurable: true,
      });
    } catch {
      // Ignore if read-only
    }
    return;
  }

  if (!existing.subtle || !(existing.subtle as SubtleCrypto).digest) {
    try {
      Object.defineProperty(existing, "subtle", {
        value: fallbackSubtle,
        configurable: true,
      });
    } catch {
      try {
        (existing as unknown as { subtle: SubtleCrypto }).subtle =
          fallbackSubtle as SubtleCrypto;
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

/**
 * Ensures a robust Web Crypto implementation is available.
 * Attempts to borrow from Node's crypto if global crypto is insufficient.
 */
async function ensureWebCrypto() {
  const existing = globalThis.crypto as Crypto | undefined;
  if (existing?.subtle?.digest) return;

  try {
    const nodeCrypto = await import("crypto");
    if (nodeCrypto?.webcrypto?.subtle) {
      const nodeSubtle = nodeCrypto.webcrypto.subtle as SubtleCrypto;
      const nodeGetRandomValues = nodeCrypto.webcrypto.getRandomValues?.bind(
        nodeCrypto.webcrypto,
      );
      const current = globalThis.crypto as Crypto | undefined;
      if (
        current &&
        (!current.subtle || !(current.subtle as SubtleCrypto).digest)
      ) {
        try {
          Object.defineProperty(current, "subtle", {
            value: nodeSubtle,
            configurable: true,
          });
        } catch {
          try {
            (current as unknown as { subtle: SubtleCrypto }).subtle =
              nodeSubtle;
          } catch {
            // Ignore if read-only
          }
        }
      }
      if (current && !current.getRandomValues && nodeGetRandomValues) {
        try {
          Object.defineProperty(current, "getRandomValues", {
            value: nodeGetRandomValues,
            configurable: true,
          });
        } catch {
          try {
            (
              current as unknown as {
                getRandomValues: typeof nodeGetRandomValues;
              }
            ).getRandomValues = nodeGetRandomValues;
          } catch {
            // Ignore if read-only
          }
        }
      }
    }
  } catch {
    // Ignore and keep polyfill
  }
}

/**
 * Loads the Taffy Layout WASM module and registers the preview.
 *
 * @returns The loaded Taffy module.
 */
async function loadTaffy() {
  try {
    await ensureWebCrypto();
    const wasmUrl =
      "https://unpkg.com/taffy-layout@latest/pkg/taffy_wasm_bg.wasm";
    const mod = await import("taffy-layout/wasm");
    if (mod && typeof mod.default === "function") {
      await mod.default(wasmUrl);
    }
    Object.assign(globalThis, mod);
    registerPreview(mod);
    return mod;
  } catch (error) {
    console.error("Failed to load taffy-layout wasm", error);
    throw error;
  }
}

export const ready = loadTaffy();
