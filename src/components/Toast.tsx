import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const TOAST_DOT: Record<ToastType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

export const ShowToast: React.FC<{
  message: string;
  type?: ToastType;
  isVisible?: boolean;
}> = ({ message, type = "error", isVisible = false }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    setShowToast(false);
  }, [isVisible, message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 backdrop-blur-sm border rounded-2xl shadow-2xl transition-all duration-500 z-50 ${
        TOAST_STYLES[type]
      } ${
        showToast
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className={`w-2 h-2 rounded-full animate-pulse ${TOAST_DOT[type]}`} />
      <span className="text-sm font-semibold tracking-wide">{message}</span>
    </div>
  );
};

/**
 * Standalone toast notification without external visibility control.
 * Shows automatically when message is provided.
 */
export const AutoToast: React.FC<{ message: string; type?: ToastType }> = ({
  message,
  type = "error",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 backdrop-blur-sm border rounded-2xl shadow-2xl transition-all duration-500 z-50 ${
        TOAST_STYLES[type]
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className={`w-2 h-2 rounded-full animate-pulse ${TOAST_DOT[type]}`} />
      <span className="text-sm font-semibold tracking-wide">{message}</span>
    </div>
  );
};