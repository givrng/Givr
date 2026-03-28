import { useEffect, useState } from "react";

export const ResendOtpTimer: React.FC<{ onResend: () => void }> = ({ onResend }) => {
  const COOLDOWN = 60; // seconds
  const [timeLeft, setTimeLeft] = useState(COOLDOWN);

  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResend = () => {
    onResend();
    setTimeLeft(COOLDOWN);
  };

  return (
    <button
      onClick={handleResend}
      disabled={timeLeft > 0}
      className={`text-sm ${
        timeLeft > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
      }`}
    >
      {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
    </button>
  );
};
