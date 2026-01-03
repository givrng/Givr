import { useState } from "react";

type VerifyEmailOtpModalProps = {
  email: string;
  onSubmit: (otp: string) => Promise<void>;
  isOpen:boolean;
};

export const VerifyEmailOtpModal = ({email, onSubmit, isOpen
}: VerifyEmailOtpModalProps) => {

    if(!isOpen)
        return null

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit(otp);
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full p-6">
      <h3 className="text-base font-semibold text-[#323338] mb-1">
        Verify Email
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Enter the 6-digit code sent to <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center tracking-[0.4em] text-lg rounded-md border border-ui px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••"
          autoFocus
        />

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-4 py-2 text-sm rounded-md bg-[#0073EA] text-white disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify Email"}
        </button>
      </form>
    </div>
  );
};
