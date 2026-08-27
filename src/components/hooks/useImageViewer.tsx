import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
 * The overlay is rendered through a React portal into `document.body` so it is
 * never clipped or repositioned by an ancestor with `transform`, `filter`, or
 * `overflow` (e.g. project cards that lift on hover). This is the same
 * strategy used by Radix UI, shadcn/ui, MUI, Chakra and Headless UI.
 */
function ImageViewerModalContent({
  payload,
  onClose,
}: {
  payload: ImageViewerPayload;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-3xl sm:m-4 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 truncate pr-4">
            {payload.title || "Image preview"}
          </h3>
          <button
            type="button"
            onClick={onClose}
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
}

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

  const ImageViewerModal = useCallback(() => {
    if (!payload) return null;
    return createPortal(
      <ImageViewerModalContent payload={payload} onClose={closeImage} />,
      document.body
    );
  }, [payload, closeImage]);

  return { openImage, closeImage, ImageViewerModal };
};