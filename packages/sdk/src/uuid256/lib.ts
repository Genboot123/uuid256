import type { U256Hex, Uuid } from "./types.ts";
import { uuidV7Generate, validateUuid } from "./deps.ts";
import { RE_U256 } from "./const.ts";

export function isUuid(s: string): s is Uuid {
  if (!validateUuid(s)) return false;
  return s.length === 36 && s[14] === "7";
}
export function asUuid(s: string): Uuid {
  if (!isUuid(s)) throw new Error("INVALID_UUID_FORMAT");
  return s as Uuid;
}

export function generateUuidV7(): Uuid {
  return uuidV7Generate() as Uuid;
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
