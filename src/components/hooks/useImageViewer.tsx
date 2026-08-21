import { useCallback, useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { downloadFile } from "../../utils/fileDownload";

interface ImageViewerPayload {
  url: string;
  title?: string;
  downloadName?: string;
}

/**
 * Reusable full-screen image lightbox.
 *
 * Behaves like a proper mobile dialog: on small screens the panel slides up
 * from the bottom, on larger screens it is centered. Includes a close button,
 * a title, and an optional download action.
 */
export const useImageViewer = () => {
  const [payload, setPayload] = useState<ImageViewerPayload | null>(null);

  const openImage = useCallback((data: ImageViewerPayload) => {
    setPayload(data);
  }, []);

  const closeImage = useCallback(() => {
    setPayload(null);
  }, []);

  // Lock background scroll while the lightbox is open, and close on Escape.
  useEffect(() => {
    if (!payload) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [payload, closeImage]);

  const ImageViewerModal = () => {
    if (!payload) return null;

    return (
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeImage}
        />

        <div className="relative bg-white w-full sm:max-w-3xl sm:m-4 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 truncate pr-4">
              {payload.title || "Image preview"}
            </h3>
            <button
              type="button"
              onClick={closeImage}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 shrink-0"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-gray-900/60 p-2 sm:p-4 max-h-[70vh] overflow-y-auto">
            <img
              src={payload.url}
              alt={payload.title || "Preview"}
              className="w-full max-h-[60vh] object-contain rounded-lg"
            />
          </div>

          <div className="p-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() =>
                void downloadFile(payload.url, payload.downloadName || "flier")
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-[#1A73E8] text-white hover:bg-[#156cd4] transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { openImage, closeImage, ImageViewerModal };
};