import type { U256Hex, Uuid } from "./types.ts";
import { uuidV7Generate, validateUuidV7 } from "./deps.ts";
import { RE_RFC4122, RE_U256 } from "./const.ts";

/**
 * Type guard that checks whether the given string is a canonical RFC 4122 UUID
 * (any version such as v1/v4/v7).
 *
 * @param s - Candidate string to validate.
 * @returns `true` if `s` is a canonical UUID, otherwise `false`.
 *
 * @example
 * ```ts
 * if (isUuid(id)) {
 *   // id is now typed as Uuid
 * }
 * ```
 */
export function isUuid(s: string): s is Uuid {
  // RFC 4122 canonical format: 8-4-4-4-12 with correct version and variant bits
  // Versions accepted: 1-8 (includes v7). Variant: 8, 9, a, or b
  return RE_RFC4122.test(s);
}

/**
 * Type guard for UUID (v7) specifically.
 */
export function isUuidV7(s: string): s is Uuid {
  return validateUuidV7(s);
}

/**
 * Asserts the given string is a UUID and returns it typed as {@link Uuid}.
 *
 * @param s - String to validate and narrow.
 * @returns The same string, typed as {@link Uuid}, if validation succeeds.
 * @throws Error with code "INVALID_UUID_FORMAT" when `s` is not a UUID.
 *
 * @example
 * ```ts
 * const id = asUuid(generateUuidV7());
 * ```
 */
export function asUuid(s: string): Uuid {
  if (!isUuid(s)) throw new Error("INVALID_UUID_FORMAT");
  return s as Uuid;
}

/**
 * Asserts the given string is a UUID (v7) and returns it typed as {@link Uuid}.
 */
export function asUuidV7(s: string): Uuid {
  if (!validateUuidV7(s)) throw new Error("INVALID_UUID_FORMAT");
  return s as Uuid;
}

/**
 * Generates a random UUID.
 */
export function generateUuid(): Uuid {
  return crypto.randomUUID();
}

/**
 * Generates a standards-compliant UUID (v7) string.
 *
 * The resulting string is suitable for lexicographic ordering by time.
 *
 * @returns Newly generated {@link Uuid}.
 *
 * @example
 * ```ts
 * const id = generateUuidV7();
 * ```
 */
export function generateUuidV7(): Uuid {
  return uuidV7Generate() as Uuid;
}

/**
 * Converts a bigint to a canonical 256-bit hex string with a `0x` prefix.
 *
 * Pads to 64 hex digits.
 *
 * @param x - The bigint value to convert.
 * @returns A canonical `0x`-prefixed 64-nybble hex string.
 */
function toCanonicalU256Hex(x: bigint): U256Hex {
  return ("0x" + x.toString(16).padStart(64, "0")) as U256Hex;
}

/**
 * Encodes a UUID into a canonical 256-bit hex string.
 *
 * The UUID's 128 bits are placed in the lower 128 bits of the returned
 * 256-bit value; the upper 128 bits are zero. Input may be either a
 * hyphenated UUID string or a 32-hex-nybble string.
 *
 * @param uuid - UUID string to convert.
 * @returns {@link U256Hex} with the UUID in the lower 128 bits.
 * @throws Error with code "INVALID_UUID_FORMAT" if `uuid` is not 32 hex nybbles after removing dashes.
 *
 * @example
 * ```ts
 * const hex = uuidToU256(generateUuidV7()); // e.g. 0x0000...<64 hex chars>
 * ```
 *
 * @see {@link u256ToUuid}
 */
export function uuidToU256(uuid: string): U256Hex {
  const cleaned = uuid.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(cleaned)) throw new Error("INVALID_UUID_FORMAT");
  const lower128 = BigInt("0x" + cleaned);
  return toCanonicalU256Hex(lower128);
}

/**
 * Decodes the lower 128 bits of a 256-bit hex string into a UUID string.
 *
 * Requires the upper 128 bits to be zero (i.e., the value must have been
 * produced by {@link uuidToU256}).
 *
 * @param id - Canonical {@link U256Hex} (`0x`-prefixed, 64 hex nybbles).
 * @returns The hyphenated UUID string.
 * @throws Error with code "INVALID_U256_FORMAT" if `id` is not a canonical 256-bit hex.
 * @throws Error with code "UPPER128_NOT_ZERO" if any upper 128-bit is non-zero.
 *
 * @example
 * ```ts
 * const uuid = u256ToUuid(uuidToU256(generateUuidV7()));
 * ```
 */
export function u256ToUuid(id: string): Uuid {
  if (!RE_U256.test(id)) throw new Error("INVALID_U256_FORMAT");
  const x = BigInt(id);
  if ((x >> 128n) !== 0n) throw new Error("UPPER128_NOT_ZERO");
  const lowHex = (x & ((1n << 128n) - 1n)).toString(16).padStart(32, "0");
  return `${lowHex.slice(0, 8)}-${lowHex.slice(8, 12)}-${
    lowHex.slice(12, 16)
  }-${lowHex.slice(16, 20)}-${lowHex.slice(20)}` as Uuid;
}
