import { useCallback, useEffect, useRef } from "react";
import { ArrowRight, Clock3, ShieldCheck, X } from "lucide-react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { InitiativeForm } from "./InitiativeForm";
import type { InitiativesOutletContext } from "./IndividualDashboardPage";
import { getVerificationState, VERIFY_IDENTITY_PATH } from "../../utils/verification";

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
  const { verificationStatus, verificationLoaded, onInitiativeCreated } = useOutletContext<InitiativesOutletContext>();
  const identityState = getVerificationState(verificationStatus);
  const isVerified = identityState === "verified";
  // Show the form while the status loads, then swap to the gate if they aren't verified
  const showGate = verificationLoaded && !isVerified;

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
        </header>

        {showGate ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-12">
            <span className={`rounded-2xl p-4 ${identityState === "in_review" ? "bg-blue-50 text-[#1A73E8]" : "bg-[#EAF2FE] text-[#1A73E8]"}`}>
              {identityState === "in_review" ? <Clock3 size={34} /> : <ShieldCheck size={34} />}
            </span>
            <h3 className="mt-5 text-lg font-semibold">
              {identityState === "in_review" ? "Your verification is in review" : "Verify your identity first"}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#676879]">
              {identityState === "in_review"
                ? "You'll be able to create initiatives as soon as your verification is approved. There's nothing else you need to do."
                : identityState === "failed"
                  ? "Your last verification didn't go through. Check your name and ID number match your ID exactly, then try again. It takes a few minutes."
                  : "Only verified individuals can create initiatives, so volunteers know who they're supporting. It takes a few minutes: enter your ID and a photo, then pay the verification fee on Paystack."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={close} className="rounded-md border border-[#C3C6D4] px-4 py-2.5 text-sm font-semibold hover:bg-[#F8FAFC]">
                {identityState === "in_review" ? "Close" : "Not now"}
              </button>
              {identityState !== "in_review" && (
                <button type="button" onClick={() => navigate(VERIFY_IDENTITY_PATH)} className="inline-flex items-center gap-2 rounded-md bg-[#1A73E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#155FC0]">
                  {identityState === "failed" ? "Try again" : "Verify identity"} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <InitiativeForm
            onCancel={close}
            canSubmit={isVerified}
            onVerify={() => navigate(VERIFY_IDENTITY_PATH)}
            onCreated={() => {
              onInitiativeCreated();
              navigate("/individual", { replace: true });
            }}
          />
        )}
      </div>
    </div>
  );
};
