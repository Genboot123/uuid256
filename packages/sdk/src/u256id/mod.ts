/**
 * U256ID v2 public API.
 *
 * Canonical form is `0x` + 64 lowercase hex. Human‑readable form is Base58 with
 * the `u2:` prefix. This module exposes generators, converters, and helpers.
 *
 * @example
 * ```ts
 * import { u256id } from "@posaune0423/u256id";
 * const id = u256id.u256idV1();
 * console.log(u256id.versionOf(id)); // 1
 * console.log(u256id.toBase58(id));  // e.g. "u2:3m...Z"
 * ```
 * @module u256id
 */
export type { U256Hex } from "./types.ts";
export {
  asCanonical,
  example,
  fromBase58,
  isCanonical,
  toBase58,
  toShort,
  u256idV0,
  u256idV1,
  u256ToUuid,
  uuidToU256,
  versionOf,
} from "./lib.ts";
