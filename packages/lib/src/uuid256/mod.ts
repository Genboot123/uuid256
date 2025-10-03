/**
 * UUID v7 ↔︎ 256-bit hex conversion utilities.
 *
 * This module exposes functions to validate and convert between
 * {@link Uuid} strings and {@link U256Hex} values where the lower 128 bits
 * encode the UUID and the upper 128 bits are zero. See individual symbol
 * documentation for details and examples.
 *
 * @module
 */
export type { U256Hex, Uuid } from "./types.ts";
export {
  asUuid,
  generateUuidV7,
  isUuid,
  u256ToUuid,
  uuidToU256,
} from "./lib.ts";
