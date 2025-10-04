import { CodeBlock } from "./CodeBlock";
import { DataFlowVisual } from "./DataFlowVisual";

interface BridgeStepProps {
  uuid: string;
  uint256: string;
  onBridge: () => void;
  isActive: boolean;
}

export function BridgeStep({ uuid, uint256, onBridge, isActive }: BridgeStepProps) {
  const codeExample = `import { uuidToU256, u256ToUuid } from "uuid256";

// Convert UUID to uint256 for on-chain use
const uint256Id = uuidToU256("${uuid || "01948b2e-5890-7000-8000-0123456789ab"}");
// => ${uint256 || "2139208346887946264002379554693398187n"}

// Convert back to UUID (reversible!)
const recoveredUuid = u256ToUuid(${uint256 || "2139208346887946264002379554693398187n"});
// => "${uuid || "01948b2e-5890-7000-8000-0123456789ab"}"`;

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-white">Bridge to uint256</h3>
            <p className="text-xs md:text-sm text-slate-400">Convert for on-chain compatibility</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="bg-slate-800/30 border border-slate-600/20 rounded-lg p-2 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm text-slate-300 font-medium mb-0.5 md:mb-1">Why Bridge?</p>
                <p className="text-[10px] md:text-xs text-slate-400">
                  EVM smart contracts use uint256 for token IDs. UUID256 bridges your 128-bit UUID to 256-bit format
                  by zero-padding the upper bits, making it reversible while maintaining compatibility.
                </p>
              </div>
            </div>
          </div>

          <DataFlowVisual uuid={uuid} uint256={uint256} direction="both" />

          <CodeBlock code={codeExample} title="bridge.ts" />

          <button
            onClick={onBridge}
            disabled={!isActive || !uuid}
            className="group relative w-full px-4 py-2.5 md:px-6 md:py-4 bg-gradient-to-r from-indigo-600 to-slate-700 text-white text-sm md:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-slate-800 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Bridge to uint256
            </span>
          </button>

          {uint256 && (
            <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-2 md:p-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs md:text-sm font-medium text-green-300">Bridged Successfully</span>
              </div>
              <p className="text-[10px] md:text-sm font-mono text-white break-all bg-slate-900/50 rounded p-2 md:p-3">{uint256}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
