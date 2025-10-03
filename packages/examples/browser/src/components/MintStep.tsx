import { CodeBlock } from "./CodeBlock";
import { WalletInfo } from "./WalletInfo";
import type { Chain } from "viem/chains";

interface MintStepProps {
  uuid: string;
  uint256: string;
  chain: Chain;
  contractAddress: string;
  account: string;
  busy: boolean;
  onConnect: () => void;
  onMint: () => void;
  isActive: boolean;
}

export function MintStep({
  uuid,
  uint256,
  chain,
  contractAddress,
  account,
  busy,
  onConnect,
  onMint,
  isActive,
}: MintStepProps) {
  const codeExample = `import { walletClient } from "./client";
import { uuid256 } from "uuid256";

const uuid = "${uuid || "01948b2e-5890-7000-8000-0123456789ab"}";
const tokenId = uuid256.uuidToU256(uuid);

// Mint NFT with the bridged uint256 ID
const hash = await walletClient.writeContract({
  address: "${contractAddress}",
  abi: contractABI,
  functionName: "mint",
  args: [tokenId] // Use uint256 on-chain
});

// The NFT is now minted with ID: ${uint256 || "2139208346887946264002379554693398187n"}`;

  return (
    <div>
      <div className={`bg-slate-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border transition-all duration-300 ${
        isActive
          ? "border-indigo-500/40 shadow-lg shadow-indigo-500/10"
          : "border-slate-700/50"
      }`}>
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-7 h-7 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-slate-700 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-white">Mint NFT On-Chain</h3>
            <p className="text-xs md:text-sm text-slate-400">Create NFT with bridged uint256 ID</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="bg-slate-800/30 border border-slate-600/20 rounded-lg p-2 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm text-slate-300 font-medium mb-0.5 md:mb-1">On-Chain Storage</p>
                <p className="text-[10px] md:text-xs text-slate-400">
                  The smart contract stores the uint256 ID on-chain. Your off-chain database can keep the original UUID,
                  and you can bridge between them anytime using the UUID256 library.
                </p>
              </div>
            </div>
          </div>

          <WalletInfo chain={chain} contractAddress={contractAddress} account={account} />

          <CodeBlock code={codeExample} title="mint.ts" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            {!account ? (
              <button
                onClick={onConnect}
                disabled={!isActive}
                className="group relative px-4 py-2.5 md:px-6 md:py-4 bg-gradient-to-r from-indigo-600 to-slate-700 text-white text-sm md:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-slate-800 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect Wallet
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-center px-4 py-2.5 md:px-6 md:py-4 bg-slate-800/50 border-2 border-green-500/30 rounded-xl">
                <div className="flex items-center gap-1.5 md:gap-2 text-green-400">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm md:text-base font-medium">Connected</span>
                </div>
              </div>
            )}

            <button
              onClick={onMint}
              disabled={!isActive || !account || !uint256 || busy}
              className="group relative px-4 py-2.5 md:px-6 md:py-4 bg-gradient-to-r from-indigo-600 to-slate-700 text-white text-sm md:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-slate-800 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!busy && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
              <span className="relative flex items-center justify-center gap-2">
                {busy ? (
                  <>
                    <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Minting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Mint NFT
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
