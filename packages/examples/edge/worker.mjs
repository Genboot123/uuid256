import { u256id } from "u256id";

const worker = {
  async fetch(_req) {
    const id = u256id.u256idV1();
    const body = JSON.stringify({
      canonical: id,
      version: u256id.versionOf(id),
      hr: u256id.toBase58(id),
      short: u256id.toShort(id),
    });
    return new Response(body, { headers: { "content-type": "application/json" } });
  },
};

export default worker;
