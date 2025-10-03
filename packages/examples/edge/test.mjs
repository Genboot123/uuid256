import worker from "./worker.mjs";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) throw new Error("Missing CONTRACT_ADDRESS env var");

const url = `http://local/?rpc=${encodeURIComponent(RPC_URL)}&addr=${encodeURIComponent(CONTRACT_ADDRESS)}`;
const resp = await worker.fetch(new Request(url));
const json = await resp.json();
if (typeof json.uuid !== "string" || typeof json.bridged !== "string" || typeof json.owner !== "string" || typeof json.uri !== "string") {
  console.error(json);
  throw new Error("Unexpected edge response shape");
}
console.log("edge e2e ok", { owner: json.owner });
