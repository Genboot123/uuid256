const { uuid256 } = require("uuid256");
// Node CJS may not have globalThis.crypto: use node:crypto.webcrypto
if (typeof globalThis.crypto === "undefined") {
  const { webcrypto } = require("node:crypto");
  globalThis.crypto = webcrypto;
}

const uuid = uuid256.generateUuidV7();
console.log("[Node]  UUID:", uuid);
const bridged = uuid256.uuidToU256(uuid);
console.log("[Node]  Bridged:", bridged.substring(0, 20) + "...");
const tokenId = BigInt(bridged);
console.log("[Node]  Token ID:", tokenId);
