interface MintSectionProps {
  account: string;
  contractAddress: string;
  busy: boolean;
  onConnect: () => void;
  onMint: () => void;
}

export function MintSection({
  account,
  contractAddress,
  busy,
  onConnect,
  onMint,
}: MintSectionProps) {
  return (
    <div className="border-t border-slate-700/50 pt-6">
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 className="text-lg font-semibold text-white">Actions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!account ? (
          <button
            onClick={onConnect}
            className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-lg">Connect Wallet</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-center px-6 py-4 bg-slate-800/50 border-2 border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-green-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Wallet Connected</span>
            </div>
          </div>
        )}

        <button
          onClick={onMint}
          disabled={busy || !contractAddress || !account}
          className={`group relative px-6 py-4 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden ${
            busy || !contractAddress || !account
              ? "bg-slate-700/30 text-slate-500 cursor-not-allowed border-2 border-slate-700/30"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-95 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 focus:ring-purple-500"
          }`}
        >
          {!busy && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
          {busy ? (
            <span className="relative flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg">Minting...</span>
            </span>
          ) : (
            <span className="relative flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-lg">Mint NFT</span>
            </span>
          )}
        </button>
      </div>

      {!account && (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-amber-300 font-medium mb-1">Wallet Required</p>
              <p className="text-xs text-amber-400/80">Please connect your wallet to mint NFTs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
