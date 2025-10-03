/**
 * Canonical 256-bit identifier string: "0x" + 64 lowercase hex characters.
 *
 * This branded type represents the canonical storage/transport form accepted by
 * helpers in this module.
 */
export type U256Hex = `0x${string}`;
