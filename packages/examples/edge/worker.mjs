import { uuid256 } from "u256id";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const worker = {
  async fetch(req) {
    const url = new URL(req.url);
    const RPC_URL = url.searchParams.get("rpc") || "http://127.0.0.1:8545";
    const CONTRACT_ADDRESS = url.searchParams.get("addr");
    const PRIVATE_KEY = (url.searchParams.get("pk") || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80").toLowerCase();
    if (!CONTRACT_ADDRESS) {
      return new Response(JSON.stringify({ error: "missing addr param" }), { status: 400 });
    }

    // minimal ABI for mint/ownerOf/tokenURI
    const abi = [
      { "type": "function", "name": "mint", "stateMutability": "nonpayable", "inputs": [
        { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "outputs": [] },
      { "type": "function", "name": "ownerOf", "stateMutability": "view", "inputs": [ { "name": "tokenId", "type": "uint256" } ], "outputs": [ { "type": "address" } ] },
      { "type": "function", "name": "tokenURI", "stateMutability": "view", "inputs": [ { "name": "tokenId", "type": "uint256" } ], "outputs": [ { "type": "string" } ] }
    ];

    const account = privateKeyToAccount(PRIVATE_KEY);
    const wallet = createWalletClient({ account, transport: http(RPC_URL) });
    const publicClient = createPublicClient({ transport: http(RPC_URL) });

    const uuid = uuid256.generateUuidV7();
    const bridged = uuid256.uuidToU256(uuid);
    const tokenId = BigInt(bridged);

    await wallet.writeContract({ address: CONTRACT_ADDRESS, abi, functionName: "mint", args: [account.address, tokenId] });
    const owner = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "ownerOf", args: [tokenId] });
    const uri = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "tokenURI", args: [tokenId] });

    const body = JSON.stringify({ uuid, bridged, owner, uri });
    return new Response(body, { headers: { "content-type": "application/json" } });
  },
};

export default worker;
