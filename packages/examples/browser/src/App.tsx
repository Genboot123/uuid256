import { useState, useMemo } from "react";
import { DEFAULT_CHAIN, CONTRACT_ADDRESS } from "./config/constants.ts";
import { useWallet } from "./hooks/useWallet.ts";
import { useNFTMint } from "./hooks/useNFTMint.ts";
import { WalletInfo } from "./components/WalletInfo.tsx";
import { MintSection } from "./components/MintSection.tsx";
import { OutputDisplay } from "./components/OutputDisplay.tsx";

export function App() {
  const chain = DEFAULT_CHAIN;
  const { account, connectWallet } = useWallet(chain);
  const { busy, result, error, mint } = useNFTMint(chain, account);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleConnect = async () => {
    try {
      await connectWallet();
      setSuccessMessage("Wallet connected!");
    } catch (_e) {
      // Error is already handled in useWallet
    }
  };

  const handleMint = async () => {
    try {
      setSuccessMessage("");
      await mint(CONTRACT_ADDRESS);
    } catch (_e) {
      // Error is already handled in useNFTMint
    }
  };

  const output = useMemo(() => {
    if (error) return error;
    if (successMessage) return successMessage;
    if (result) {
      return [
        `uuid v7: ${result.uuid}`,
        `bridged u256: ${result.bridged}`,
        `owner: ${result.owner}`,
        `tokenURI: ${result.tokenURI}`,
      ].join("\n");
    }
    return "";
  }, [error, successMessage, result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">U256ID NFT Minter</h1>
            <p className="text-blue-100 mt-2">React + Vite + Tailwind CSS</p>
          </div>

          <div className="p-8 space-y-6">
            <WalletInfo
              chain={chain}
              contractAddress={CONTRACT_ADDRESS}
              account={account}
            />

            <MintSection
              account={account}
              contractAddress={CONTRACT_ADDRESS}
              busy={busy}
              onConnect={handleConnect}
              onMint={handleMint}
            />

            <OutputDisplay output={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
