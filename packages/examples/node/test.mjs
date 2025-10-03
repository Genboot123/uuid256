import { u256id } from "u256id";

const id = u256id.u256idV1();
console.log("ESM canonical:", id);
console.log("version:", u256id.versionOf(id));
console.log("hr:", u256id.toBase58(id));
console.log("short:", u256id.toShort(id));

if (typeof globalThis.crypto === "undefined") {
  throw new Error("WebCrypto should be available in ESM (Node >=18) or via polyfill");
}
