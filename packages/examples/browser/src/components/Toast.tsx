import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ show, message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // 10秒間表示
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const colors = {
    success: "from-green-500 to-emerald-500",
    error: "from-red-500 to-rose-500",
    info: "from-blue-500 to-cyan-500",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  // Extract URL from message if present
  const urlMatch = message.match(/(https?:\/\/[^\s]+)/);
  const url = urlMatch ? urlMatch[1] : null;
  const messageWithoutUrl = url ? message.replace(url, "").trim() : message;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-500">
      <div className={`bg-gradient-to-r ${colors[type]} rounded-xl shadow-2xl p-4 flex items-start gap-3 max-w-md backdrop-blur-sm`}>
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm whitespace-pre-line break-words">{messageWithoutUrl}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-white/90 hover:text-white text-sm underline underline-offset-2 transition-colors"
            >
              View on Explorer
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
