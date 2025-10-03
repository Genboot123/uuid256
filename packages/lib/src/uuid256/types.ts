/**
 * Canonical UUID v7 string type.
 *
 * Represents a 36-character, hyphenated UUID string where the version nibble
 * is 7. Use {@link import("./lib.ts").isUuid | isUuid} or
 * {@link import("./lib.ts").asUuid | asUuid} to validate or narrow values to
 * this type.
 */
export type Uuid = string;

/**
 * Canonical 256-bit hexadecimal string with `0x` prefix.
 *
 * This is always 66 characters long: the `0x` prefix followed by exactly 64
 * lowercase hexadecimal digits. Use
 * {@link import("./lib.ts").uuidToU256 | uuidToU256} and
 * {@link import("./lib.ts").u256ToUuid | u256ToUuid} to convert between
 * {@link Uuid} and {@link U256Hex}.
 */
export type U256Hex = `0x${string}`;
