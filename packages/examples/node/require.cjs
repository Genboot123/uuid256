const { uuid256 } = require("u256id");
// Node CJS may not have globalThis.crypto: use node:crypto.webcrypto
if (typeof globalThis.crypto === "undefined") {
  const { webcrypto } = require("node:crypto");
  uuid256.setCrypto(webcrypto);
}

const uuid = uuid256.generateUuidV7();
const bridged = uuid256.uuidToU256(uuid);
const back = uuid256.u256ToUuid(bridged);
console.log("uuid v7:", uuid);
console.log("bridged u256:", bridged);
console.log("roundtrip uuid:", back);
