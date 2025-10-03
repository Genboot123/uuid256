import worker from "./worker.mjs";

const resp = await worker.fetch(new Request("http://local/"));
const json = await resp.json();
if (typeof json.canonical !== "string" || json.version !== 1) {
  throw new Error("Unexpected edge response shape");
}
console.log("edge ok", json.short);
