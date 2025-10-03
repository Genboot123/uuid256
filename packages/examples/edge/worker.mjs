import { uuid256 } from "u256id";

const worker = {
  async fetch(_req) {
    const uuid = uuid256.generateUuidV7();
    const bridged = uuid256.uuidToU256(uuid);
    const back = uuid256.u256ToUuid(bridged);
    const body = JSON.stringify({ uuid, bridged, back });
    return new Response(body, { headers: { "content-type": "application/json" } });
  },
};

export default worker;
