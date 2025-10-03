import { useState } from "react";
import { uuid256 } from "uuid256";
import { DEFAULT_CHAIN, CONTRACT_ADDRESS } from "./config/constants";
import { useWallet } from "./hooks/useWallet";
import { useNFTMint } from "./hooks/useNFTMint";
import { StepIndicator } from "./components/StepIndicator";
import { GenerateStep } from "./components/GenerateStep";
import { BridgeStep } from "./components/BridgeStep";
import { MintStep } from "./components/MintStep";
import { QueryStep } from "./components/QueryStep";
import { Toast } from "./components/Toast";

const STEPS = [
  { id: 1, title: "Generate", description: "Create UUID" },
  { id: 2, title: "Bridge", description: "Convert to uint256" },
  { id: 3, title: "Mint", description: "Create NFT on-chain" },
  { id: 4, title: "Query", description: "Retrieve NFT data" },
];

export function App() {
  const chain = DEFAULT_CHAIN;
  const { account, connectWallet } = useWallet(chain);
  const { busy, mint } = useNFTMint(chain, account);

  const [currentStep, setCurrentStep] = useState(1);
  const [uuid, setUuid] = useState("");
  const [uint256, setUint256] = useState("");
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ show: true, message, type });
  };

  const handleGenerate = () => {
    const newUuid = uuid256.generateUuidV7();
    setUuid(newUuid);
    setCurrentStep(2);
  };

  const handleBridge = () => {
    const bridged = uuid256.uuidToU256(uuid);
    setUint256(bridged.toString());
    setCurrentStep(3);
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMint = async () => {
    try {
      const tokenId = BigInt(uint256);
      const mintResult = await mint(CONTRACT_ADDRESS, uuid, tokenId);
      showToast(
        "NFT minted successfully! 🎉\n View on Etherscan: https://sepolia.basescan.org/tx/" +
          mintResult.txHash,
        "success"
      );
      setCurrentStep(4);
    } catch (error) {
      console.error(error);
      showToast("Failed to mint NFT", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-2 py-3 md:px-4 md:py-8 lg:py-12 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-1.5 md:gap-3 mb-2 md:mb-4">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-slate-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg
                className="w-4 h-4 md:w-7 md:h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h1 className="text-lg md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-slate-300 to-indigo-500">
              UUID256 Interactive Tutorial
            </h1>
          </div>
          <p className="text-slate-300 text-xs md:text-base lg:text-lg max-w-3xl mx-auto px-2">
            Learn how UUID bridges to uint256 for on-chain NFTs with
            reversible conversion
          </p>
          <div className="flex items-center justify-center gap-1 md:gap-2 mt-2 md:mt-4 text-[10px] md:text-sm text-slate-400">
            <div className="px-1.5 py-0.5 md:px-3 md:py-1 bg-slate-800/50 rounded-full border border-slate-700">
              UUID
            </div>
            <div className="px-1.5 py-0.5 md:px-3 md:py-1 bg-slate-800/50 rounded-full border border-slate-700">
              ↔
            </div>
            <div className="px-1.5 py-0.5 md:px-3 md:py-1 bg-slate-800/50 rounded-full border border-slate-700">
              uint256
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-3 md:mb-6 lg:mb-8">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50 p-2 md:p-6 lg:p-8">
          <div className="space-y-3 md:space-y-6 lg:space-y-8">
            <GenerateStep
              uuid={uuid}
              onGenerate={handleGenerate}
              isActive={currentStep === 1}
            />

            <BridgeStep
              uuid={uuid}
              uint256={uint256}
              onBridge={handleBridge}
              isActive={currentStep === 2}
            />

            <MintStep
              uuid={uuid}
              uint256={uint256}
              chain={chain}
              contractAddress={CONTRACT_ADDRESS}
              account={account}
              busy={busy}
              onConnect={handleConnect}
              onMint={handleMint}
              isActive={currentStep === 3}
            />

            <QueryStep
              chain={chain}
              contractAddress={CONTRACT_ADDRESS}
              uuid={uuid}
              uint256={uint256}
              isActive={currentStep === 4}
              onQueryComplete={() => setCurrentStep(5)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 md:mt-6 lg:mt-8 text-center text-slate-400 text-xs md:text-sm">
          <p>Powered by UUID256</p>
        </div>
      </div>

      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
