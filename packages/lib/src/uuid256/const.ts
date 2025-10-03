/**
 * Regular expression matching a canonical 256-bit hex string.
 *
 * Matches `0x` followed by exactly 64 lowercase hexadecimal digits.
 * Used by {@link import("./lib.ts").u256ToUuid | u256ToUuid} to validate
 * inputs.
 */
export const RE_U256 = /^0x[0-9a-f]{64}$/;

/**
 * Regular expression matching a canonical RFC 4122 UUID.
 *
 * Matches `8-4-4-4-12` with correct version and variant bits.
 * Used by {@link import("./lib.ts").isUuid | isUuid} to validate inputs.
 */
export const RE_RFC4122 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
