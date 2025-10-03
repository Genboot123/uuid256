/**
 * U256ID SDK entrypoint.
 *
 * Re-exports the `u256id` module under a single namespace.
 *
 * @example
 * ```ts
 * import { u256id } from "@posaune0423/u256id";
 *
 * const id = u256id.u256idV0();
 * const hr = u256id.toBase58(id);
 * ```
 * @module
 */
export * as u256id from "./u256id/mod.ts";
