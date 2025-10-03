interface DataFlowVisualProps {
  uuid?: string;
  uint256?: string;
  direction?: "forward" | "backward" | "both";
}

export function DataFlowVisual({ uuid, uint256, direction = "both" }: DataFlowVisualProps) {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4">
        {/* UUID Side */}
        <div className="flex-1">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span className="text-xs font-semibold text-blue-300">UUID v7</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 min-h-[80px] flex items-center justify-center">
            {uuid ? (
              <p className="text-sm font-mono text-white break-all text-center">{uuid}</p>
            ) : (
              <p className="text-xs text-slate-500 italic">Not generated yet</p>
            )}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-slate-400">128-bit identifier</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex md:flex-col items-center justify-center gap-2 md:gap-2 md:px-4 w-full md:w-auto">
          {(direction === "forward" || direction === "both") && (
            <div className="flex items-center gap-2">
              <div className="text-xs text-purple-400 font-mono whitespace-nowrap">uuidToU256()</div>
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400 animate-pulse md:rotate-0 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          )}
          {direction === "both" && (
            <div className="md:w-px md:h-4 w-4 h-px bg-slate-700"></div>
          )}
          {(direction === "backward" || direction === "both") && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-pink-400 animate-pulse md:rotate-0 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <div className="text-xs text-pink-400 font-mono whitespace-nowrap">u256ToUuid()</div>
            </div>
          )}
        </div>

        {/* uint256 Side */}
        <div className="flex-1">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-2">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs font-semibold text-purple-300">uint256</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 min-h-[80px] flex items-center justify-center">
            {uint256 ? (
              <p className="text-sm font-mono text-white break-all text-center">{uint256}</p>
            ) : (
              <p className="text-xs text-slate-500 italic">Not bridged yet</p>
            )}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-slate-400">256-bit on-chain ID</span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-lg">
        <div className="flex items-start gap-2 md:gap-3">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-purple-300 font-medium mb-1">Reversible Bridging</p>
            <p className="text-xs text-slate-400">
              UUID256 provides lossless, bidirectional conversion between UUID v7 and uint256.
              The upper 128 bits are always zero, preserving the original UUID data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
