import { expect } from "@std/expect";
import { test } from "@std/testing/bdd";
import {
  asUuid,
  generateUuidV7,
  isUuid,
  u256ToUuid,
  uuidToU256,
} from "../src/uuid256/mod.ts";

test("generateUuidV7 produces valid v7 UUID", () => {
  const uuid = generateUuidV7();
  expect(isUuid(uuid)).toBe(true);
});

test("uuidToU256 -> u256ToUuid round trip", () => {
  const uuid = generateUuidV7();
  const id = uuidToU256(uuid);
  const back = u256ToUuid(id);
  expect(back).toBe(uuid.toLowerCase());
});

test("u256ToUuid rejects when upper 128 bits are non-zero", () => {
  const bad = (1n << 200n) | 0xdeadbeefn;
  const badHex = "0x" + bad.toString(16).padStart(64, "0");
  expect(() => u256ToUuid(badHex)).toThrow("UPPER128_NOT_ZERO");
});

test("asUuid validates format", () => {
  const good = generateUuidV7();
  expect(asUuid(good)).toBe(good);
  expect(() => asUuid("not-a-uuid")).toThrow();
});
