/**
 * Regular expression matching a canonical 256-bit hex string.
 *
 * Matches `0x` followed by exactly 64 lowercase hexadecimal digits.
 * Used by {@link import("./lib.ts").u256ToUuid | u256ToUuid} to validate
 * inputs.
 */
export const RE_U256 = /^0x[0-9a-f]{64}$/;
