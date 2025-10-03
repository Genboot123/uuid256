import { uuid256 } from "u256id";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
  const PRIVATE_KEY = (process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80").toLowerCase();
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  if (!CONTRACT_ADDRESS) throw new Error("Missing CONTRACT_ADDRESS env var");

  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ transport: http(RPC_URL) });

  // minimal ABI subset
  const abi = [
    { type: "function", name: "mint", stateMutability: "nonpayable", inputs: [
      { name: "to", type: "address" }, { name: "tokenId", type: "uint256" } ], outputs: [] },
    { type: "function", name: "ownerOf", stateMutability: "view", inputs: [ { name: "tokenId", type: "uint256" } ], outputs: [ { type: "address" } ] },
    { type: "function", name: "tokenURI", stateMutability: "view", inputs: [ { name: "tokenId", type: "uint256" } ], outputs: [ { type: "string" } ] },
  ] as const;

  const uuid = uuid256.generateUuidV7();
  const bridged = uuid256.uuidToU256(uuid);
  const tokenId = BigInt(bridged);

  await wallet.writeContract({ address: CONTRACT_ADDRESS, abi, functionName: "mint", args: [account.address, tokenId] });
  const owner = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "ownerOf", args: [tokenId] });
  if (owner.toLowerCase() !== account.address.toLowerCase()) throw new Error("owner mismatch");
  const uri = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "tokenURI", args: [tokenId] });
  console.log("bun e2e ok", { uuid, bridged, owner, uri });
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
