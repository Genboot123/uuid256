interface OutputDisplayProps {
  output: string;
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  if (!output) return null;

  const isError = output.toLowerCase().includes("error") || output.toLowerCase().includes("failed");
  const isSuccess = output.toLowerCase().includes("wallet connected");

  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Output</h2>

      <div
        className={`rounded-lg p-4 ${
          isError
            ? "bg-red-50 border border-red-200"
            : isSuccess
            ? "bg-green-50 border border-green-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <pre className={`text-sm whitespace-pre-wrap font-mono ${
          isError
            ? "text-red-800"
            : isSuccess
            ? "text-green-800"
            : "text-blue-900"
        }`}>
          {output}
        </pre>
      </div>
    </div>
  );
}
