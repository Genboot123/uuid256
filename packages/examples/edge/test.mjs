import process from "node:process";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xb081A8327db8e5c6BbDC13d9C452b13ef37a941c";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY env var");
  process.exit(1);
}

// Expect Wrangler dev running on 8787 (Base Sepolia only)
const url = `http://127.0.0.1:8787/?addr=${encodeURIComponent(CONTRACT_ADDRESS)}&pk=${encodeURIComponent(PRIVATE_KEY)}`;
const resp = await fetch(url);
const json = await resp.json();
if (typeof json.uuid !== "string" || typeof json.bridged !== "string" || typeof json.owner !== "string" || typeof json.uri !== "string") {
  console.error(json);
  throw new Error("Unexpected edge response shape");
}
console.log("edge e2e ok", { owner: json.owner });
