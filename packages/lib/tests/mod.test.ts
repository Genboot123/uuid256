import { expect } from "@std/expect";
import { test } from "@std/testing/bdd";
import {
  asUuid,
  generateUuidV7,
  isUuid,
  u256ToUuid,
  uuidToU256,
} from "../src/uuid256/mod.ts";

test("generateUuidV7 produces valid UUID", () => {
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

// Additional coverage: accept non-v7 UUIDs (e.g., v4)
// Known valid UUID v4 example (variant 2, version 4)
const VALID_V4 = "550e8400-e29b-41d4-a716-446655440000";

test("isUuid accepts v4 UUID", () => {
  expect(isUuid(VALID_V4)).toBe(true);
});

test("uuidToU256 accepts v4 UUID and round-trips", () => {
  const id = uuidToU256(VALID_V4);
  const back = u256ToUuid(id);
  expect(back).toBe(VALID_V4);
});
