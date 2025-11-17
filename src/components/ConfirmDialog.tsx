import {
  WarningIcon,
  CloseIcon

} from "./icons";
 import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  visible,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {

  const modalRef = useRef<HTMLDivElement | null>(null);
    // Close when clicking outside the modal
    useEffect(() => {
      function handleOutsideClick(e: MouseEvent) {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }

      if (visible) {
        document.addEventListener("mousedown", handleOutsideClick);
      }

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [visible, onClose]);
  if (!visible) return null;

  return (
    <div className="fixed inset-0  backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#DAF0FF] p-6 rounded-lg " ref={modalRef}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <WarningIcon />
            <h2 className="text-base text-[#323338] ml-2 font-semibold ">
              Attention!
            </h2>
          </div>
          <div onClick={onClose} className="cursor-pointer">
            <CloseIcon />
          </div>
        </div>
        <h3 className="text-sm text-[#323338] font-medium mb-3">
          Are you sure you want to cancel your application?
        </h3>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-(--primary-color) text-white rounded-lg hover:bg-gray-400 transition"
          >
            Don't cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-white text-[#D83A52] rounded-lg hover:bg-amber-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
