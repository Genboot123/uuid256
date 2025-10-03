import { uuid256 } from "uuid256";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xb081A8327db8e5c6BbDC13d9C452b13ef37a941c";

const CONTRACT_ABI = [
  "function mint(address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

const worker = {
  async fetch(req, env) {
    try {
      const PRIVATE_KEY = env.PRIVATE_KEY;
      const RPC_URL = env.RPC_URL;

      if (!PRIVATE_KEY) {
        return new Response(
          JSON.stringify(
            {
              error: "PRIVATE_KEY not configured in environment",
              hint: "Set PRIVATE_KEY in .env file for local development",
            },
            null,
            2
          ),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          }
        );
      }

      // Connect to Base Sepolia
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        wallet
      );

      // Generate UUID and bridge to uint256
      const uuid = uuid256.generateUuidV7();
      console.log("[Edge]  UUID:", uuid);
      const bridged = uuid256.uuidToU256(uuid);
      console.log("[Edge]  Bridged:", bridged.substring(0, 20) + "...");
      const tokenId = BigInt(bridged);
      console.log("[Edge]  Token ID:", tokenId);

      // Mint NFT
      const tx = await contract.mint(wallet.address, tokenId);
      console.log("[Edge]  Mint tx:", tx.hash);
      console.log("[Edge]  Waiting for transaction confirmation...");
      await tx.wait(2); // Wait for 2 confirmations
      console.log("[Edge]  Transaction confirmed!");

      // Read back the data
      const owner = await contract.ownerOf(tokenId);
      const uri = await contract.tokenURI(tokenId);

      const result = {
        uuid,
        bridged,
        tokenId: tokenId.toString(),
        owner,
        tokenURI: uri,
        txHash: tx.hash,
        timestamp: new Date().toISOString(),
      };

      return new Response(JSON.stringify(result, null, 2), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          {
            error: error.message,
            stack: error.stack,
          },
          null,
          2
        ),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }
  },
};

export default worker;
