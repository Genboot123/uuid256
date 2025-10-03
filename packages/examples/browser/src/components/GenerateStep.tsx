import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

interface GenerateStepProps {
  uuid: string;
  onGenerate: () => void;
  isActive: boolean;
}

export function GenerateStep({ uuid, onGenerate, isActive }: GenerateStepProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const codeExample = `import { uuid256 } from "uuid256";

// Generate a new UUID
const uuid = uuid256.generateUuidV7();
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-white">Generate UUID</h3>
            <p className="text-xs md:text-sm text-slate-400">Create a time-ordered unique identifier</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="bg-slate-800/30 border border-slate-600/20 rounded-lg p-2 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs md:text-sm text-slate-300 font-medium mb-0.5 md:mb-1">What is UUID?</p>
                <p className="text-[10px] md:text-xs text-slate-400">
                  UUID (v7) is a time-ordered UUID format that includes a timestamp, making it sortable and ideal for database keys.
                  It's a 128-bit (16 bytes) identifier with built-in temporal ordering.
                </p>
              </div>
            </div>
          </div>

          <CodeBlock code={codeExample} title="generate.ts" />

          <button
            onClick={onGenerate}
            disabled={!isActive}
            className="group relative w-full px-4 py-2.5 md:px-6 md:py-4 bg-gradient-to-r from-indigo-600 to-slate-700 text-white text-sm md:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-slate-800 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate UUID
            </span>
          </button>

          {uuid && (
            <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-2 md:p-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs md:text-sm font-medium text-green-300">Generated Successfully</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 group">
                <p className="text-[10px] md:text-sm font-mono text-white break-all bg-slate-900/50 rounded p-2 md:p-3 flex-1">{uuid}</p>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 md:p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
                  title="Copy UUID"
                >
                  {copied ? (
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 group-hover:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
