import React, { useState, useEffect, useRef } from "react";
import { Mail, Edit2, Check, Loader2, AlertCircle } from "lucide-react";
import type { AxiosResponse } from "axios";

type VerifyEmailModalProps = {
  email: string;
  onSubmit: (otp:string)=>Promise<AxiosResponse<any, any, any>>;
  otpRequest?: ()=>Promise<undefined>;
  onEmailChange?: (email:string)=>Promise<undefined> | Promise<void>;
  isOpen: boolean;
  onSuccess: ()=>void;
  close: ()=>void;
}

export const VerifyEmailOtpModal = ({
  email: initialEmail,
  onSubmit,
  otpRequest,
  onEmailChange,
  isOpen,
  onSuccess,
  close
}: VerifyEmailModalProps) => {
  // Hooks must be called unconditionally per React rules
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cooldown Logic State
  const [countDown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const timerRef = useRef<null|number>(null);

  const COOL_TIME = 20;

  // --- Effects ---
  // Handle countdown interval (must be called before any conditional return)
  useEffect(() => {
    if (countDown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [countDown]);

  // --- Handlers ---
  const handleToggleEmailEdit = async () => {
    if (isEditingEmail) {
      setLoading(true);
      setError("");
      try {
        if (onEmailChange) {
          await onEmailChange(email);
        }
        setIsEditingEmail(false);
      } catch {
        setError("Failed to update email address.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditingEmail(onEmailChange != null);
    }
  };

  // Guard render after all hooks are established
  if (!isOpen) return null;

  const handleRequestOtp = async () => {
    if (countDown > 0) return;

    setError("");
    const delay = COOL_TIME + (attempts * COOL_TIME) / 2;

    setCountdown(Math.floor(delay));
    setAttempts((prev) => prev + 1);

    if (otpRequest) {
      try {
        await otpRequest();
      } catch {
        setError("Failed to resend code. Please try again.");
      }
    }
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit(otp);
      onSuccess();
    } catch (err:any) {
      const status = err?.response?.status;
      if (status === 404) {
        setError(`${email} is not associated with an account`);
      } else if (status === 400) {
        setError("Invalid or expired OTP");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    onClick={()=>{
      close()
    }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
      onClick={(e)=>e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Verify Your Email</h3>
            <p className="mt-1 text-sm text-gray-500">
              We've sent a 6-digit verification code to
            </p>
          </div>

          {/* Email Modification Row */}
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2 pl-4">
            {isEditingEmail && onEmailChange != null ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none"
                autoFocus
              />
            ) : (
              <span className="flex-1 truncate text-sm font-medium text-gray-900">
                {email}
              </span>
            )}
            <button
              onClick={handleToggleEmailEdit}
              disabled={loading}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                isEditingEmail
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-white text-gray-500 hover:text-blue-600 shadow-sm border border-gray-200"
              }`}
              title={isEditingEmail ? "Save Email" : "Edit Email"}
            >
              {isEditingEmail ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-14 w-full rounded-xl border border-gray-200 text-center text-2xl font-bold tracking-[0.5em] transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
                placeholder="000000"
                disabled={loading || isEditingEmail}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || isEditingEmail}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={countDown > 0 || loading || isEditingEmail}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-blue-600 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                {countDown > 0
                  ? `Resend code in ${countDown}s`
                  : "Didn't receive a code? Resend"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailOtpModal;