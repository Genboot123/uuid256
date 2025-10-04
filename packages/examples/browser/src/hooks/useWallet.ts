import { useState, useCallback } from "react";
import type { Chain } from "viem/chains";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

export function useWallet(chain: Chain) {
  const [account, setAccount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const connectWallet = useCallback(async () => {
    try {
      setError("");

      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Web3 wallet");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      // Switch to the target chain if needed
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chain.id.toString(16)}` }],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (switchError: any) {
        // Chain not added, try to add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chain.id.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default.http,
                blockExplorerUrls: [chain.blockExplorers?.default.url],
              },
            ],
          });
        }
      }

      return accounts[0];
    } catch (e) {
      const errorMessage = `Connection failed: ${String(e)}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [chain]);

  return {
    account,
    error,
    connectWallet,
  };
}
