import type { U256Hex, Uuid } from "./types.ts";

// WebCrypto wiring (Node needs explicit injection sometimes)
let cryptoImpl: Crypto | undefined = (globalThis as { crypto?: Crypto }).crypto;
export function setCrypto(crypto: Crypto): void {
  cryptoImpl = crypto;
}
function requireCrypto(): Crypto {
  if (!cryptoImpl || typeof cryptoImpl.getRandomValues !== "function") {
    throw new Error(
      "WebCrypto not available. Use setCrypto(webcrypto) in Node.",
    );
  }
  return cryptoImpl;
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function rnd(n: number): Uint8Array {
  const a = new Uint8Array(n);
  requireCrypto().getRandomValues(a);
  return a;
}

const RE_UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const RE_U256 = /^0x[0-9a-f]{64}$/;

export function isUuid(s: string): s is Uuid {
  return RE_UUID_V7.test(s);
}
export function asUuid(s: string): Uuid {
  if (!isUuid(s)) throw new Error("INVALID_UUID_FORMAT");
  return s as Uuid;
}

export function generateUuidV7(): Uuid {
  const b = new Uint8Array(16);
  const ts = BigInt(Date.now()); // milliseconds since Unix epoch
  // write 48-bit timestamp (big-endian) into b[0..5]
  b[0] = Number((ts >> 40n) & 0xffn);
  b[1] = Number((ts >> 32n) & 0xffn);
  b[2] = Number((ts >> 24n) & 0xffn);
  b[3] = Number((ts >> 16n) & 0xffn);
  b[4] = Number((ts >> 8n) & 0xffn);
  b[5] = Number(ts & 0xffn);
  // fill remaining with random
  const r = rnd(10);
  b.set(r, 6);
  // set version 7 in b[6] high nibble
  b[6] = (b[6] & 0x0f) | 0x70;
  // set RFC 4122 variant (10xxxxxx) in b[8]
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = toHex(b);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${
    hex.slice(16, 20)
  }-${hex.slice(20)}` as Uuid;
}

function toCanonicalU256Hex(x: bigint): U256Hex {
  return ("0x" + x.toString(16).padStart(64, "0")) as U256Hex;
}

export function uuidToU256(uuid: string): U256Hex {
  const cleaned = uuid.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(cleaned)) throw new Error("INVALID_UUID_FORMAT");
  const lower128 = BigInt("0x" + cleaned);
  return toCanonicalU256Hex(lower128);
}

export function u256ToUuid(id: string): Uuid {
  if (!RE_U256.test(id)) throw new Error("INVALID_U256_FORMAT");
  const x = BigInt(id);
  if ((x >> 128n) !== 0n) throw new Error("UPPER128_NOT_ZERO");
  const lowHex = (x & ((1n << 128n) - 1n)).toString(16).padStart(32, "0");
  return `${lowHex.slice(0, 8)}-${lowHex.slice(8, 12)}-${
    lowHex.slice(12, 16)
  }-${lowHex.slice(16, 20)}-${lowHex.slice(20)}` as Uuid;
}
