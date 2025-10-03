import { useState } from "react";
import { uuid256 } from "uuid256";
import { createPublicClient, http, type Chain } from "viem";
import { CodeBlock } from "./CodeBlock";
import { CONTRACT_ABI } from "../config/constants";

interface QueryStepProps {
  chain: Chain;
  contractAddress: string;
  uuid: string;
  uint256: string;
  isActive: boolean;
  onQueryComplete: () => void;
}

export function QueryStep({ chain, contractAddress, uuid, uint256, isActive, onQueryComplete }: QueryStepProps) {
  const [queryInput, setQueryInput] = useState("");
  const [queryType, setQueryType] = useState<"uuid" | "uint256">("uuid");
  const [queryResult, setQueryResult] = useState<{ tokenURI: string; queriedUuid: string; queriedUint256: string } | null>(null);
  const [querying, setQuerying] = useState(false);
  const [queryError, setQueryError] = useState<string>("");

  const handleQuery = async () => {
    if (!queryInput) return;

    try {
      setQuerying(true);
      setQueryError("");
      setQueryResult(null);

      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      let tokenId: bigint;
      let queriedUuid: string;
      let queriedUint256: string;

      if (queryType === "uuid") {
        // Convert UUID to uint256
        queriedUuid = queryInput;
        queriedUint256 = uuid256.uuidToU256(queryInput);
        tokenId = BigInt(queriedUint256);
      } else {
        // Use uint256 directly and convert to UUID
        queriedUint256 = queryInput;
        tokenId = BigInt(queryInput);
        queriedUuid = uuid256.u256ToUuid(queriedUint256);
      }

      // Query tokenURI from contract
      const tokenURI = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "tokenURI",
        args: [tokenId],
      });

      setQueryResult({
        tokenURI: tokenURI as string,
        queriedUuid,
        queriedUint256,
      });
      onQueryComplete();
    } catch (error) {
      console.error("Query error:", error);
      setQueryError("Failed to query NFT. Make sure the token exists.");
    } finally {
      setQuerying(false);
    }
  };

  const codeExampleUuid = `import { publicClient } from "./client";
import { uuid256 } from "uuid256";

// Query using original UUID
const uuid = "${uuid || "01948b2e-5890-7000-8000-0123456789ab"}";
const tokenId = uuid256.uuidToU256(uuid);

// Get tokenURI using the bridged uint256
const tokenURI = await publicClient.readContract({
  address: contractAddress,
  abi: contractABI,
  functionName: "tokenURI",
  args: [tokenId]
});
// => "https://example.com/0x..."`;

  const codeExampleUint256 = `import { publicClient } from "./client";
import { uuid256 } from "uuid256";

// Query using uint256 (from blockchain event)
const tokenId = ${uint256 || "2139208346887946264002379554693398187n"};

// Get tokenURI
const tokenURI = await publicClient.readContract({
  address: contractAddress,
  abi: contractABI,
  functionName: "tokenURI",
  args: [tokenId]
});

// Convert back to UUID for your database
const uuid = uuid256.u256ToUuid(tokenId);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-white">Query NFT</h3>
            <p className="text-xs md:text-sm text-slate-400">Use either UUID or uint256 to query</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-4">
          <div className="bg-slate-800/30 border border-slate-600/20 rounded-lg p-2 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            <div>
              <p className="text-xs md:text-sm text-slate-300 font-medium mb-0.5 md:mb-1">Flexible Querying</p>
              <p className="text-[10px] md:text-xs text-slate-400 mb-1 md:mb-2">
                With UUID256, you can query NFTs using either format! The tokenURI is retrieved using the bridged uint256:
              </p>
              <ul className="text-[10px] md:text-xs text-slate-400 space-y-0.5 md:space-y-1 ml-3 md:ml-4 list-disc">
                <li>Have UUID from your database? Convert to uint256 and query tokenURI</li>
                <li>Have uint256 from blockchain event? Query directly and convert back to UUID</li>
                <li>Both representations point to the same NFT with the same tokenURI!</li>
              </ul>
            </div>
            </div>
          </div>

          {/* Query Type Selector */}
          <div className="flex gap-1.5 md:gap-2 p-0.5 md:p-1 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <button
              onClick={() => setQueryType("uuid")}
              className={`flex-1 px-2 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                queryType === "uuid"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Query by UUID
            </button>
            <button
              onClick={() => setQueryType("uint256")}
              className={`flex-1 px-2 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                queryType === "uint256"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Query by uint256
            </button>
          </div>

          <CodeBlock
            code={queryType === "uuid" ? codeExampleUuid : codeExampleUint256}
            title={`query-by-${queryType}.ts`}
          />

          {/* Query Input */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-3 md:p-4">
            <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2">
              Enter {queryType === "uuid" ? "UUID" : "uint256"} to query
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={queryType === "uuid" ? uuid || "Enter UUID..." : uint256 || "Enter uint256..."}
                className="flex-1 px-3 md:px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white font-mono text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                onKeyDown={(e) => e.key === "Enter" && handleQuery()}
              />
              <button
                onClick={() => {
                  if (queryType === "uuid") {
                    setQueryInput(uuid);
                  } else {
                    setQueryInput(uint256);
                  }
                }}
                disabled={!uuid || !uint256}
                className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Fill
              </button>
            </div>
            <button
              onClick={handleQuery}
              disabled={!queryInput || querying}
              className="w-full px-4 py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-slate-700 text-white text-sm md:text-base font-semibold rounded-xl hover:from-indigo-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/20"
            >
              {querying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Querying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Query NFT
                </span>
              )}
            </button>
          </div>

          {queryError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs md:text-sm text-red-300">{queryError}</p>
              </div>
            </div>
          )}

          {queryResult && (
            <div className="space-y-2 md:space-y-3 animate-in fade-in duration-300">
              <div className="flex items-start gap-2 md:gap-3 p-2 md:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                <svg className="w-4 h-4 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-base text-green-300 font-semibold mb-0.5 md:mb-1">NFT Found!</p>
                  <p className="text-[10px] md:text-sm text-green-400/80">Successfully retrieved tokenURI from contract</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 md:gap-3">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-2 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-indigo-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-slate-300">UUID</p>
                  </div>
                  <p className="text-[10px] md:text-sm text-white font-mono break-all">{queryResult.queriedUuid}</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-2 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-indigo-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-slate-300">uint256</p>
                  </div>
                  <p className="text-[10px] md:text-sm text-white font-mono break-all">{queryResult.queriedUint256}</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-2 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-indigo-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-slate-300">Token URI</p>
                  </div>
                  <p className="text-[10px] md:text-sm text-white font-mono break-all">{queryResult.tokenURI}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
