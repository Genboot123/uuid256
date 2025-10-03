/**
 * U256ID SDK entrypoint.
 *
 * Re-exports the `u256id` module under a single namespace.
 *
 * @example
 * ```ts
 * import { uuid256 } from "@posaune0423/u256id";
 *
 * const id = uuid256.u256idV0();
 * const hr = uuid256.toBase58(id);
 * ```
 * @module
 */
export * as uuid256 from "./uuid256/mod.ts";
