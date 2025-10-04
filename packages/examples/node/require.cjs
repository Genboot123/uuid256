const { generateUuidV7, uuidToU256 } = require("uuid256");
// Node CJS may not have globalThis.crypto: use node:crypto.webcrypto
if (typeof globalThis.crypto === "undefined") {
  const { webcrypto } = require("node:crypto");
  globalThis.crypto = webcrypto;
}

const uuid = generateUuidV7();
console.log("[Node]  UUID:", uuid);
const bridged = uuidToU256(uuid);
console.log("[Node]  Bridged:", bridged);
const tokenId = BigInt(bridged);
console.log("[Node]  Token ID:", tokenId);
