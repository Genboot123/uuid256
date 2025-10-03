import { uuid256 } from "u256id";

const uuid = uuid256.generateUuidV7();
const bridged = uuid256.uuidToU256(uuid);
const back = uuid256.u256ToUuid(bridged);

console.log("uuid v7:", uuid);
console.log("bridged u256:", bridged);
console.log("roundtrip uuid:", back);

if (typeof globalThis.crypto === "undefined") {
  throw new Error("WebCrypto should be available in ESM (Node >=18) or via polyfill");
}
