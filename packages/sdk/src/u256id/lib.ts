// U256ID v2 (canonical: 0x + 64 hex; HR: Base58; versions: v0, v1)
// Deno/Browser compatible (uses WebCrypto). No external deps.
import type { U256Hex } from "./types.ts";

/** Canonical regex: 0x + 64 lowercase hex */
const RE_CANON = /^0x[0-9a-f]{64}$/;

/** Base58 (Bitcoin) alphabet: excludes 0,O,I,l */
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const B58_INDEX: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (let i = 0; i < B58.length; i++) m[B58[i]] = i;
  return m;
})();

/** ---- utilities ---- **/

const cryptoObj: Crypto = (globalThis.crypto ??
  // deno-lint-ignore no-explicit-any
  (globalThis as any).require?.("crypto")?.webcrypto) as Crypto;

function assert(cond: boolean, msg = "assertion failed"): asserts cond {
  if (!cond) throw new Error(msg);
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// intentionally unused utility (reserved for future I/O helpers)
function _fromHex(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  assert(clean.length % 2 === 0, "bad hex length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function rnd(n: number): Uint8Array {
  const a = new Uint8Array(n);
  cryptoObj.getRandomValues(a);
  return a;
}

/** big-endian bytes -> bigint */
function beBytesToBigInt(b: Uint8Array): bigint {
  let x = 0n;
  for (const v of b) x = (x << 8n) | BigInt(v);
  return x;
}

/** bigint -> big-endian bytes (fixed len) */
// intentionally unused utility (reserved for future I/O helpers)
function _bigIntToBeBytes(x: bigint, len: number): Uint8Array {
  const out = new Uint8Array(len);
  for (let i = len - 1; i >= 0; i--) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out;
}

/** ---- canonical helpers ---- **/

/**
 * Check whether a string is in canonical form (`0x` + 64 lowercase hex).
 *
 * @param s String to validate.
 * @returns `true` if the string is canonical, otherwise `false`.
 * @example
 * ```ts
 * isCanonical("0x" + "00".repeat(32)); // true
 * isCanonical("deadbeef");             // false
 * ```
 */
export const isCanonical = (s: string): s is U256Hex => RE_CANON.test(s);

/** Format bigint 256-bit to canonical 0x+64 lowercase hex */
function toCanonical(x: bigint): U256Hex {
  const hex = x.toString(16).padStart(64, "0");
  return ("0x" + hex) as U256Hex;
}

/** ---- Base58 (HR) ---- **/

/**
 * Convert a canonical `U256Hex` to the human‑readable Base58 form with `u2:`
 * prefix.
 *
 * @param id Canonical identifier.
 * @returns Base58 string like `"u2:..."`.
 * @example
 * ```ts
 * const id = u256idV0();
 * toBase58(id); // "u2:..."
 * ```
 */
export function toBase58(id: U256Hex): string {
  const x = BigInt(id); // canonical is valid 0x+hex, BigInt parses it
  if (x === 0n) return "u2:1"; // 0 encodes to "1"
  let n = x;
  let s = "";
  while (n > 0n) {
    const rem = Number(n % 58n);
    s = B58[rem] + s;
    n = n / 58n;
  }
  return "u2:" + s;
}

/**
 * Parse a Base58 human‑readable string (with or without `u2:` prefix) back to
 * canonical form.
 *
 * @param hr Base58 string, optionally prefixed with `"u2:"`.
 * @returns Canonical `U256Hex`.
 * @example
 * ```ts
 * const id = fromBase58("u2:3m...");
 * isCanonical(id); // true
 * ```
 */
export function fromBase58(hr: string): U256Hex {
  const s = hr.startsWith("u2:") ? hr.slice(3) : hr;
  assert(/^[1-9A-HJ-NP-Za-km-z]+$/.test(s), "bad Base58 chars");
  let x = 0n;
  for (const ch of s) {
    const v = B58_INDEX[ch];
    assert(v !== undefined, "bad Base58 char");
    x = x * 58n + BigInt(v);
  }
  return toCanonical(x);
}

/**
 * Create a short display‑only representation. Do not accept as input.
 *
 * @param id Canonical identifier.
 * @returns A string like `"u2s:deadbeef…cafebabe"`.
 */
export const toShort = (id: U256Hex): string =>
  `u2s:${id.slice(2, 10)}…${id.slice(-8)}`;

/**
 * Read the 4‑bit version nibble from the top of the 256‑bit value.
 *
 * @param id Canonical identifier.
 * @returns Integer in range 0..15.
 */
export function versionOf(id: U256Hex): number {
  return Number((BigInt(id) >> 252n) & 0xfn);
}

/** ---- generators ---- **/

/**
 * Generate a v0 identifier: purely random, version nibble `0000`.
 *
 * @returns New random canonical `U256Hex`.
 * @example
 * ```ts
 * const id = u256idV0();
 * versionOf(id); // 0
 * ```
 */
export function u256idV0(): U256Hex {
  const b = rnd(32);
  b[0] &= 0x0f; // clear top 4 bits -> version=0
  return ("0x" + toHex(b)) as U256Hex;
}

/**
 * Generate a v1 identifier (time‑sortable): `0001|T48|N32|C16|R156`.
 *
 * T = unix milliseconds, N = node id (optional, fixed; random if omitted),
 * C = per‑millisecond monotonic counter, R = random bits.
 *
 * @param opts Optional options; when provided, `opts.node32` fixes the node id.
 * @returns New canonical `U256Hex` with version nibble 1.
 * @example
 * ```ts
 * const a = u256idV1();
 * const b = u256idV1();
 * // `a` and `b` will sort by time when compared lexicographically as hex
 * ```
 */
let _node32: number | undefined;
let _lastMs = -1;
let _ctr = 0;
export function u256idV1(opts?: { node32?: number }): U256Hex {
  const now = Date.now();
  if (_node32 === undefined) {
    if (opts?.node32 !== undefined) {
      _node32 = opts.node32 >>> 0;
    } else {
      const dv = new DataView(rnd(4).buffer);
      _node32 = dv.getUint32(0);
    }
  }
  if (now !== _lastMs) {
    _lastMs = now;
    _ctr = 0;
  }
  const c = (_ctr = (_ctr + 1) & 0xffff);

  // pack fields into 256-bit BE bytes
  // layout (bit indices from MSB=255 to LSB=0):
  // [255..252]=0001, [251..204]=T(48), [203..172]=N(32), [171..156]=C(16), [155..0]=R(156)
  let x = 0n;
  x |= 0x1n << 252n; // version
  x |= (BigInt(now) & 0xffff_ffff_ffffn) << 204n; // T48
  x |= (BigInt(_node32!) & 0xffff_ffffn) << 172n; // N32
  x |= (BigInt(c) & 0xffffn) << 156n; // C16
  // R156:
  const r = beBytesToBigInt(rnd(20)); // 160 bits random
  x |= r & ((1n << 156n) - 1n); // take lower 156 bits

  return toCanonical(x);
}

/** ---- UUID bridge (optional) ----
 * UUID (16B) <-> lower 128 bits of uint256 (upper 128 bits must be zero)
 */

/**
 * Convert a UUID string (36‑char with dashes or 32‑hex) into the lower 128 bits
 * of a 256‑bit value. Upper 128 bits are zero.
 *
 * @param uuid Standard UUID string.
 * @returns Canonical `U256Hex`.
 */
export function uuidToU256(uuid: string): U256Hex {
  // accept "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" or 32hex
  const cleaned = uuid.replace(/-/g, "").toLowerCase();
  assert(/^[0-9a-f]{32}$/.test(cleaned), "bad uuid format");
  const lower128 = BigInt("0x" + cleaned);
  // no version nibble set here; this is just a bridge (version left as whatever the UUID has)
  const x = lower128; // upper 128 = 0
  return toCanonical(x);
}

/**
 * Convert a canonical `U256Hex` into a UUID string. Requires the upper 128 bits
 * to be zero.
 *
 * @param id Canonical identifier.
 * @returns UUID string in `8-4-4-4-12` format.
 */
export function u256ToUuid(id: U256Hex): string {
  const x = BigInt(id);
  assert((x >> 128n) === 0n, "upper 128 bits must be zero");
  const lowHex = (x & ((1n << 128n) - 1n)).toString(16).padStart(32, "0");
  // insert dashes 8-4-4-4-12
  return `${lowHex.slice(0, 8)}-${lowHex.slice(8, 12)}-${
    lowHex.slice(12, 16)
  }-${lowHex.slice(16, 20)}-${lowHex.slice(20)}`;
}

/** ---- helpers for canonical I/O ---- **/

/**
 * Assert that a string is canonical; throws if invalid.
 *
 * @param s Input string.
 * @returns The same string, typed as `U256Hex` on success.
 * @example
 * ```ts
 * const id = asCanonical("0x" + "00".repeat(32));
 * // ok: id is U256Hex here
 * ```
 */
export function asCanonical(s: string): U256Hex {
  assert(isCanonical(s), "not canonical 0x+64hex");
  return s as U256Hex;
}

/**
 * Convenience helper that demonstrates common operations for docs/testing.
 *
 * @returns A small sample of generated/derived values.
 * @example
 * ```ts
 * const { v0, v1, hr, short } = example();
 * ```
 */
export function example(): {
  v0: U256Hex;
  v1: U256Hex;
  hr: string;
  short: string;
} {
  const v0 = u256idV0();
  const hr = toBase58(v0);
  return { v0, v1: u256idV1(), hr, short: toShort(v0) };
}
