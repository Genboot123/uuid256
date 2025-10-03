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
    async (contractAddress: string) => {
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

        const uuid = uuid256.generateUuidV7();
        const bridged = uuid256.uuidToU256(uuid);
        const tokenId = BigInt(bridged);

        await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: "mint",
          args: [account as `0x${string}`, tokenId],
        });

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
