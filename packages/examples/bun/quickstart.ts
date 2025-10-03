import { u256id } from "u256id";

const id = u256id.u256idV1();
console.log("bun canonical:", id);
console.log("version:", u256id.versionOf(id));
console.log("hr:", u256id.toBase58(id));
console.log("short:", u256id.toShort(id));
