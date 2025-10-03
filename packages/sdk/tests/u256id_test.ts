import { expect } from "@std/expect";
import { test } from "@std/testing/bdd";
import {
  asCanonical,
  fromBase58,
  isCanonical,
  toBase58,
  toShort,
  u256idV0,
  u256idV1,
  versionOf,
} from "../src/u256id/mod.ts";

test("v0 canonical shape and version", () => {
  const id = u256idV0();
  expect(isCanonical(id)).toBe(true);
  expect(versionOf(id)).toBe(0);
});

test("v1 canonical shape and version", () => {
  const id = u256idV1();
  expect(isCanonical(id)).toBe(true);
  expect(versionOf(id)).toBe(1);
});

test("Base58 round trip", () => {
  const id = u256idV0();
  const hr = toBase58(id);
  const back = fromBase58(hr);
  expect(back).toBe(id);
});

test("Short format is non-empty and prefixed", () => {
  const id = u256idV0();
  const s = toShort(id);
  expect(s.startsWith("u2s:")).toBe(true);
  expect(s.length).toBeGreaterThan(10);
});

test("asCanonical validates", () => {
  const id = u256idV0();
  expect(asCanonical(id)).toBe(id);
});
