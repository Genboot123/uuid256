import type { Chain } from "viem/chains";
import { useState } from "react";

interface WalletInfoProps {
  chain: Chain;
  contractAddress: string;
  account: string;
}

export function WalletInfo({
  chain,
  contractAddress,
  account,
}: WalletInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-5">
        <svg
          className="w-5 h-5 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-white">Connection Info</h2>
      </div>

      <div className="space-y-4">
        {/* Chain Info */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Network</p>
              <p className="text-sm text-white font-medium">{chain.name}</p>
              <p className="text-xs text-slate-500">Chain ID: {chain.id}</p>
            </div>
          </div>
        </div>

        {/* Contract Address */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors group">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 mb-1">Contract Address</p>
              <p className="text-sm text-white font-mono break-all md:hidden">
                <a
                  href={`https://sepolia.basescan.org/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                {truncateAddress(contractAddress)}
              </p>
              <p className="text-sm text-white font-mono break-all hidden md:block">
                <a
                  href={`https://sepolia.basescan.org/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contractAddress}
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(contractAddress, "contract")}
            className="ml-2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
            title="Copy address"
          >
            {copiedField === "contract" ? (
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Account Status */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors group">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                account
                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                  : "bg-gradient-to-br from-slate-600 to-slate-700"
              }`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-slate-400">Wallet Status</p>
                {account && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Connected
                  </span>
                )}
              </div>
              {account ? (
                <>
                  <p className="text-sm text-white font-mono break-all md:hidden">
                    {truncateAddress(account)}
                  </p>
                  <p className="text-sm text-white font-mono break-all hidden md:block">
                    {account}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">Not connected</p>
              )}
            </div>
          </div>
          {account && (
            <button
              onClick={() => copyToClipboard(account, "account")}
              className="ml-2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
              title="Copy address"
            >
              {copiedField === "account" ? (
                <svg
                  className="w-4 h-4 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-slate-400 group-hover:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
