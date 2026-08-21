import React, { useState, useEffect, useCallback } from "react";
import { Share2, Copy, Check, X } from "lucide-react";

// --- Interfaces ---

interface ShareData {
  title: string;
  text: string;
  url: string;
  /** Text used on the primary "Share" button. Defaults to "Share". */
  label?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
}

// --- Internal Modal Component ---

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareData }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isNativeSupported, setIsNativeSupported] = useState<boolean>(false);

  // Re-evaluate support and reset copy state whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setIsNativeSupported(
      typeof navigator !== "undefined" &&
        "share" in navigator
    );
    setCopied(false);
  }, [isOpen]);

  // Lock background scroll and close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNativeShare = async (): Promise<void> => {
    try {
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        url: shareData.url,
      });
    } catch {
      // User cancelled the native share sheet, or sharing failed. No-op.
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareData.url;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked; ignore silently.
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative flex w-full max-h-[90dvh] flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl sm:max-w-md overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Share2 size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                Share
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[240px]">
                {shareData.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 shrink-0"
            aria-label="Close share dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 pb-5 pt-1 space-y-4">
          {isNativeSupported && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors active:scale-[0.98]"
            >
              <Share2 size={18} />
              {shareData.label || "Share"}
            </button>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Copy Link
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2">
              <div className="min-w-0 flex-1 px-1">
                <p className="truncate font-mono text-xs text-gray-600">
                  {shareData.url}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`shrink-0 inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-lg text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-green-50 text-green-700"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {!isNativeSupported && (
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Copy the link above to share it with anyone.
            </p>
          )}
        </div>

        {/* Safe area for notched mobile devices */}
        <div className="pb-[env(safe-area-inset-bottom)] sm:hidden" />
      </div>
    </div>
  );
};

// --- The Custom Hook ---

export const useShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ShareData>({ title: "", text: "", url: "" });

  const openShare = useCallback((shareConfig: ShareData) => {
    setData(shareConfig);
    setIsOpen(true);
  }, []);

  const closeShare = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ShareModalComponent = () => (
    <ShareModal isOpen={isOpen} onClose={closeShare} shareData={data} />
  );

  return { openShare, ShareModalComponent };
};

export default useShareModal;