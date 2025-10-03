/**
 * U256ID SDK entrypoint.
 *
 * Re-exports the `u256id` module under a single namespace.
 *
 * @example
 * ```ts
 * import { generateUuidV7, uuidToU256, u256ToUuid } from "@posaune0423/uuid256";
 *
 * const uuid = generateUuidV7();
 * const uint256 = uuidToU256(uuid);
 * const back = u256ToUuid(uint256);
 * ```
 * @module
 */
export * from "./uuid256/mod.ts";
