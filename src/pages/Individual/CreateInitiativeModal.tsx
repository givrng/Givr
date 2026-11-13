import { useCallback, useEffect, useRef } from "react";
import { ShieldCheck, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { InitiativeForm } from "./InitiativeForm";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Route-driven modal for creating an initiative.
 * Rendered over the initiatives page at /individual/create-initiative, so the URL can be
 * shared or refreshed and the browser back button closes it.
 */
export const CreateInitiativeModal: React.FC = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    // Opened from within the app: step back so history stays clean. Opened via a direct link: go to the page underneath
    if (routeLocation.key !== "default") navigate(-1);
    else navigate("/individual", { replace: true });
  }, [navigate, routeLocation.key]);

  // Lock background scroll and restore focus to the trigger when the modal closes
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      // An open dropdown closes itself on Escape; only close the modal when nothing is expanded
      if (dialogRef.current?.querySelector('[aria-expanded="true"]')) return;
      close();
      return;
    }

    // Keep keyboard focus inside the dialog
    if (event.key === "Tab" && dialogRef.current) {
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    // Backdrop clicks intentionally don't close the modal: it holds a long form and a stray click shouldn't dismiss it
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-[#0F172A]/50 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-initiative-title"
        aria-describedby="create-initiative-description"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex h-full w-full flex-col overflow-hidden bg-white text-[#323338] shadow-2xl outline-none sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-xl"
      >
        <header className="shrink-0 border-b border-[#E7EAEE] px-5 py-4 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="create-initiative-title" className="text-xl font-bold">Create an initiative</h2>
              <p id="create-initiative-description" className="mt-1 text-sm text-[#676879]">
                Share the initiative you want to lead and help people understand how they can support it.
              </p>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="rounded-full p-2 text-[#676879] transition hover:bg-[#F3FAFA] hover:text-[#323338]">
              <X size={20} />
            </button>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-md bg-[#FFF7DF] px-3 py-2 text-xs leading-5 text-[#805B00]">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            <p>Identity verification is required before an initiative can be published. Your progress is saved as you go.</p>
          </div>
        </header>

        <InitiativeForm onCancel={close} />
      </div>
    </div>
  );
};
