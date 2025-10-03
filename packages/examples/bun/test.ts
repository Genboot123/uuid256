import { uuid256 } from "uuid256";
import { createWalletClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const CONTRACT_ADDRESS = "0xb081A8327db8e5c6BbDC13d9C452b13ef37a941c";
  if (!PRIVATE_KEY) {
    throw new Error("[Bun]  Missing PRIVATE_KEY env var. Set your private key with Base Sepolia funds.");
  }

  const chain = baseSepolia;
  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http() });
  const publicClient = createPublicClient({ chain, transport: http() });

  // minimal ABI subset
  const abi = [
    { type: "function", name: "mint", stateMutability: "nonpayable", inputs: [
      { name: "to", type: "address" }, { name: "tokenId", type: "uint256" } ], outputs: [] },
    { type: "function", name: "ownerOf", stateMutability: "view", inputs: [ { name: "tokenId", type: "uint256" } ], outputs: [ { type: "address" } ] },
    { type: "function", name: "tokenURI", stateMutability: "view", inputs: [ { name: "tokenId", type: "uint256" } ], outputs: [ { type: "string" } ] },
  ] as const;

  const uuid = uuid256.generateUuidV7();
  console.log("[Bun]  UUID:", uuid);
  const bridged = uuid256.uuidToU256(uuid);
  console.log("[Bun]  Bridged:", bridged);
  const tokenId = BigInt(bridged);
  console.log("[Bun]  Token ID:", tokenId);

  console.log("[Bun]  Minting tokenId to self...");
  const hash = await wallet.writeContract({ address: CONTRACT_ADDRESS, abi, functionName: "mint", args: [account.address, tokenId] });
  console.log("[Bun]  Mint tx:", hash);

  console.log("[Bun]  Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations: 2
  });
  console.log("[Bun]  Transaction confirmed!");
  console.log("[Bun]  Receipt status:", receipt.status);

  if (receipt.status !== 'success') {
    throw new Error(`[Bun]  Transaction failed with status: ${receipt.status}`);
  }

  console.log(`[Bun]  Reading ownerOf(${tokenId})`);
  const owner = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "ownerOf", args: [tokenId] });
  if (owner.toLowerCase() !== account.address.toLowerCase()) throw new Error("owner mismatch");
  console.log(`[Bun]  Reading tokenURI ${tokenId}`);
  const uri = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi, functionName: "tokenURI", args: [tokenId] });
  console.log("[Bun]  Token URI:", uri);

  console.log("[Bun] ✅ Bun e2e test passed");
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
