import { uuid256 } from "uuid256";
import { createWalletClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const worker = {
  async fetch(req) {
    const url = new URL(req.url);
    const CONTRACT_ADDRESS = "0xb081A8327db8e5c6BbDC13d9C452b13ef37a941c";
    const PRIVATE_KEY = url.searchParams.get("pk");
    if (!PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: "missing pk param" }), { status: 400 });
    }

    // Use Base Sepolia only
    const chain = baseSepolia;

    // minimal ABI for mint/ownerOf/tokenURI
    const abi = [
      { "type": "function", "name": "mint", "stateMutability": "nonpayable", "inputs": [
        { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "outputs": [] },
      { "type": "function", "name": "ownerOf", "stateMutability": "view", "inputs": [ { "name": "tokenId", "type": "uint256" } ], "outputs": [ { "type": "address" } ] },
      { "type": "function", "name": "tokenURI", "stateMutability": "view", "inputs": [ { "name": "tokenId", "type": "uint256" } ], "outputs": [ { "type": "string" } ] }
    ];

    const account = privateKeyToAccount(PRIVATE_KEY);
    const wallet = createWalletClient({ account, chain, transport: http() });
    const publicClient = createPublicClient({ chain, transport: http() });

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
