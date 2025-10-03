import { uuid256 } from "uuid256";
import { createWalletClient, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { process } from "node:process";

async function main() {
  if (typeof globalThis.crypto === "undefined") {
    throw new Error("WebCrypto should be available in ESM (Node >=18) or via polyfill");
  }

  // Use Base Sepolia only
  const chain = baseSepolia;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xb081A8327db8e5c6BbDC13d9C452b13ef37a941c";
  if (!PRIVATE_KEY) {
    console.error("Missing PRIVATE_KEY env var. Set your private key with Base Sepolia funds.");
    process.exit(1);
  }

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const abiPath = join(__dirname, "../../../contracts/out/Uuid256TestNFT.sol/Uuid256TestNFT.json");
  const artifact = JSON.parse(await readFile(abiPath, "utf-8"));
  const abi = artifact.abi;

  const account = privateKeyToAccount(PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http() });
  const publicClient = createPublicClient({ chain, transport: http() });

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
