import type { Chain } from "viem/chains";

interface WalletInfoProps {
  chain: Chain;
  contractAddress: string;
  account: string;
}

export function WalletInfo({ chain, contractAddress, account }: WalletInfoProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Connection Info</h2>

      <div className="space-y-2">
        <div className="flex items-start">
          <span className="text-sm font-medium text-gray-600 w-24">Chain:</span>
          <span className="text-sm text-gray-900 flex-1">
            {chain.id} / <span className="font-medium">{chain.name}</span>
          </span>
        </div>

        <div className="flex items-start">
          <span className="text-sm font-medium text-gray-600 w-24">Contract:</span>
          <span className="text-sm text-gray-900 flex-1 font-mono break-all">
            {contractAddress}
          </span>
        </div>

        <div className="flex items-start">
          <span className="text-sm font-medium text-gray-600 w-24">Account:</span>
          {account ? (
            <span className="text-sm text-green-700 flex-1 font-mono break-all bg-green-50 px-2 py-1 rounded">
              {account}
            </span>
          ) : (
            <span className="text-sm text-gray-400 flex-1 italic">
              Not connected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
