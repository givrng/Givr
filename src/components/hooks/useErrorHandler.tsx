import { useCallback, useRef, useState } from "react";

type ErrorSeverity = "warning" | "error" | "info";

export interface UserFriendlyError {
  message: string;
  severity: ErrorSeverity;
  code?: string;
  action?: string;
}

/**
 * Maps HTTP status codes and common backend error codes to user-friendly messages.
 * Instead of showing generic "Failed to fetch" or raw errors,
 * we give users actionable information they can understand.
 */
export function mapErrorToUserMessage(err: unknown): UserFriendlyError {
  if (typeof err === "object" && err !== null) {
    const anyErr = err as Record<string, unknown>;

    const response = anyErr.response as Record<string, unknown> | undefined;
    const status =
      (response?.status as number) ?? (anyErr.status as number);
    const responseData = response?.data as Record<string, unknown> | undefined;

    const serverMessage: string | undefined =
      (responseData?.message as string) ??
      (responseData?.error as string) ??
      (anyErr.message as string);

    if (status === 401 || status === 403) {
      return {
        message:
          "Your session has expired. Please sign in again to continue.",
        severity: "warning",
        code: "AUTH_EXPIRED",
        action: "Sign in",
      };
    }

    if (status === 404) {
      return {
        message:
          "The requested resource could not be found. It may have been removed or the link is incorrect.",
        severity: "info",
        code: "NOT_FOUND",
      };
    }

    if (status === 409) {
      return {
        message: String(
          serverMessage ||
            "This action conflicts with the current state. Please refresh and try again."
        ),
        severity: "warning",
        code: "CONFLICT",
      };
    }

    if (status === 422) {
      return {
        message: String(
          serverMessage ||
            "Some of the information you provided is invalid. Please check and try again."
        ),
        severity: "error",
        code: "VALIDATION_ERROR",
        action: "Review your input",
      };
    }

    if (status === 429) {
      return {
        message:
          "You've made too many requests. Please wait a moment and try again.",
        severity: "warning",
        code: "RATE_LIMITED",
        action: "Wait and retry",
      };
    }

    if (status && (status >= 500 || status === 502 || status === 503)) {
      return {
        message:
          "We're experiencing technical difficulties. Our team has been notified. Please try again shortly.",
        severity: "error",
        code: "SERVER_ERROR",
        action: "Try again later",
      };
    }

    // Network error
    const code = (anyErr as { code?: string }).code;
    if (
      code === "ERR_NETWORK" ||
      code === "ECONNABORTED" ||
      (typeof serverMessage === "string" &&
        serverMessage.toLowerCase().includes("network"))
    ) {
      return {
        message:
          "Unable to connect to the server. Please check your internet connection and try again.",
        severity: "error",
        code: "NETWORK_ERROR",
        action: "Check your connection",
      };
    }

    // Any server message that came through
    if (typeof serverMessage === "string" && serverMessage.length > 0) {
      return {
        message: serverMessage,
        severity: "error",
        code: String(status ?? "UNKNOWN"),
      };
    }
  }

  // Generic fallback
  return {
    message:
      "Something unexpected happened. Please refresh the page and try again. If the problem persists, contact support.",
    severity: "error",
    code: "UNKNOWN",
    action: "Refresh page",
  };
}

/**
 * A lightweight error handler hook that can be used per-component or globally.
 */
export function useErrorHandler() {
  const [lastError, setLastError] = useState<UserFriendlyError | null>(null);
  const resolverRef = useRef<(() => void) | null>(null);

  const wrap = useCallback(
    (fn: () => Promise<unknown>): Promise<unknown> => {
      setLastError(null);
      return fn().catch((err: unknown) => {
        const userError = mapErrorToUserMessage(err);
        setLastError(userError);
        return undefined;
      });
    },
    []
  );

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const alertError = useCallback(
    (message: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        resolverRef.current = resolve;
        setLastError({
          message,
          severity: "error",
          code: "ALERT",
        });
      });
    },
    []
  );

  const ErrorBanner: React.FC = () => {
    if (!lastError) return null;

    const severityStyles: Record<ErrorSeverity, string> = {
      warning: "bg-amber-50 border-amber-200 text-amber-800",
      error: "bg-red-50 border-red-200 text-red-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const handleAction = () => {
      if (lastError.code === "AUTH_EXPIRED") {
        window.location.href = "/signin";
      }
      clearError();
      resolverRef.current?.();
    };

    const handleClose = () => {
      clearError();
      resolverRef.current?.();
    };

    return (
      <div
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg border max-w-lg w-full ${severityStyles[lastError.severity]}`}
      >
        <span className="text-sm font-medium flex-1">
          {lastError.message}
        </span>
        {lastError.action && (
          <button
            onClick={handleAction}
            className="text-xs font-bold underline hover:opacity-80 whitespace-nowrap"
          >
            {lastError.action}
          </button>
        )}
        <button
          onClick={handleClose}
          className="text-lg leading-none opacity-50 hover:opacity-100"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    );
  };

  return { wrap, lastError, clearError, alertError, ErrorBanner };
}