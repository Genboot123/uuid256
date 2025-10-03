import { uuid256 } from "u256id";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

async function main() {
  if (typeof globalThis.crypto === "undefined") {
    throw new Error("WebCrypto should be available in ESM (Node >=18) or via polyfill");
  }

  const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
  const PRIVATE_KEY = (process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80").toLowerCase();
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  if (!CONTRACT_ADDRESS) {
    console.error("Missing CONTRACT_ADDRESS env var. Deploy Uuid256TestNFT and set CONTRACT_ADDRESS.");
    process.exit(1);
  }

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const abiPath = join(__dirname, "../../../contracts/out/Uuid256TestNFT.sol/Uuid256TestNFT.json");
  const artifact = JSON.parse(await readFile(abiPath, "utf-8"));
  const abi = artifact.abi;

  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ transport: http(RPC_URL) });

  const uuid = uuid256.generateUuidV7();
  const bridged = uuid256.uuidToU256(uuid);
  const tokenId = BigInt(bridged);

  // mint bridged tokenId to self
  await wallet.writeContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "mint",
    args: [account.address, tokenId],
  });

  const owner = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "ownerOf",
    args: [tokenId],
  });
  if (owner.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error(`ownerOf mismatch: ${owner} !== ${account.address}`);
  }

  const uri = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "tokenURI",
    args: [tokenId],
  });
  if (!(typeof uri === "string" && uri.startsWith("ipfs://") && uri.includes(bridged))) {
    console.warn("tokenURI:", uri);
    throw new Error("Unexpected tokenURI format");
  }

  console.log("node e2e ok", { uuid, bridged, back: uuid256.u256ToUuid(bridged) });
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
