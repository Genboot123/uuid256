const { u256id } = require("u256id");
// Node CJS may not have globalThis.crypto: use node:crypto.webcrypto
if (typeof globalThis.crypto === "undefined") {
  const { webcrypto } = require("node:crypto");
  u256id.setCrypto(webcrypto);
}

const id = u256id.u256idV1();
console.log("CJS canonical:", id);
console.log("version:", u256id.versionOf(id));
console.log("hr:", u256id.toBase58(id));
console.log("short:", u256id.toShort(id));
