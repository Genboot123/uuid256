import { useState, useCallback } from "react";
import { uuid256 } from "uuid256";
import {
  createWalletClient,
  createPublicClient,
  http,
  custom,
  type Chain,
} from "viem";
import { CONTRACT_ABI } from "../config/constants.ts";

interface MintResult {
  txHash: string;
  uuid: string;
  bridged: string;
  owner: string;
  tokenURI: string;
}

export function useNFTMint(chain: Chain, account: string) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);
  const [error, setError] = useState<string>("");

  const mint = useCallback(
    async (contractAddress: string, uuid: string, tokenId: bigint) => {
      try {
        setBusy(true);
        setError("");
        setResult(null);

        if (!contractAddress) {
          throw new Error("Missing contract address");
        }
        if (!account) {
          throw new Error("Please connect wallet first");
        }

        const walletClient = createWalletClient({
          account: account as `0x${string}`,
          chain,
          transport: custom(window.ethereum),
        });

        const publicClient = createPublicClient({
          chain,
          transport: http(),
        });

        console.log(`[Browser]  UUID: ${uuid}`);
        const bridged = uuid256.uuidToU256(uuid);
        console.log(`[Browser]  Bridged: ${bridged}`);
        console.log(`[Browser]  Token ID: ${tokenId}`);

        // Mint NFT and wait for transaction confirmation
        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "mint",
          args: [account as `0x${string}`, tokenId],
        });

        // Wait for transaction to be confirmed
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(`[Browser]  Transaction confirmed: ${receipt.status}`);

        // After confirmation, read the NFT data
        const owner = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "ownerOf",
          args: [tokenId],
        });

        const uri = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "tokenURI",
          args: [tokenId],
        });

        const mintResult: MintResult = {
          txHash: hash,
          uuid,
          bridged,
          owner: owner as string,
          tokenURI: uri as string,
        };

        setResult(mintResult);
        return mintResult;
      } catch (e) {
        const errorMessage = String(e);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setBusy(false);
      }
    },
    [chain, account]
  );

  return {
    busy,
    result,
    error,
    mint,
  };
}
