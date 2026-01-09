import type { AxiosResponse } from "axios";
import { useState } from "react";

export interface ChangePasswordFormFields {
  otp: string;
  password: string;
  rePassword: string;
}

interface ErrorStateProps {
  isActive: boolean;
  message: string;
}

interface ErrorState {
  otpInvalid: ErrorStateProps;
  passwordTooShort: ErrorStateProps;
  passwordsNotMatch: ErrorStateProps;
  serverError: ErrorStateProps;
}

type ChangePasswordModalProps = {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordFormFields) => Promise<AxiosResponse>;
};

const initialErrors: ErrorState = {
  otpInvalid: { isActive: false, message: "Invalid OTP" },
  passwordTooShort: {
    isActive: false,
    message: "Password must be at least 8 characters",
  },
  passwordsNotMatch: {
    isActive: false,
    message: "Passwords do not match",
  },
  serverError: {
    isActive: false,
    message: "Something went wrong. Try again.",
  }
};

export const ChangePasswordModal = ({
  email,
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [fields, setFields] = useState<ChangePasswordFormFields>({
    otp: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetErrors = () => setErrors(initialErrors);

  const validate = (): boolean => {
    const newErrors = { ...initialErrors };
    let valid = true;

    if (fields.otp.length !== 6) {
      newErrors.otpInvalid.isActive = true;
      valid = false;
    }

    if (fields.password.length < 8) {
      newErrors.passwordTooShort.isActive = true;
      valid = false;
    }

    if (fields.password !== fields.rePassword) {
      newErrors.passwordsNotMatch.isActive = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (!validate()) return;

    try {
      setLoading(true);
      await onSubmit(fields);
      onClose(); // close only on success
    } catch(err:any) {
      const status = err?.response?.status;

      switch(status){
        case 400:
          setErrors(prev=>({...prev, otpInvalid: {...prev.otpInvalid, isActive: true}}))
          break
        default:
          setErrors(prev=>({...prev, serverError: {...prev.serverError, isActive: true}}))
      }
      
      setErrors(prev => ({
        ...prev,
        serverError: { ...prev.serverError, isActive: true },
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    key: keyof ChangePasswordFormFields,
    value: string
  ) => {
    setFields(prev => ({ ...prev, [key]: value }));
    
    switch(key){
      case "otp":
        setErrors(prev=>({...prev, otpInvalid:{...prev.otpInvalid, isActive:false}}))
        break
      case "password": 
        setErrors(prev=>({...prev, passwordTooShort: {...prev.passwordTooShort, isActive:false}}))
        break
      case "rePassword":
        setErrors(prev=>({...prev, passwordsNotMatch: {...prev.passwordsNotMatch, isActive:false}}))
        break
      default:
        setErrors(prev=>({...prev, serverError: {...prev.serverError, isActive:false}}))
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full p-6">
      <p className="text-sm text-gray-500 mb-4 text-center">
        An OTP has been sent to your email
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        {/* Email */}
        <div>
          <label className="text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full mt-1 rounded-md border border-ui bg-gray-100 px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* OTP */}
        <div>
          <label className="text-xs font-medium text-gray-600">OTP</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={fields.otp}
            onChange={e => handleChange("otp", e.target.value)}
            className="w-full mt-1 rounded-md border border-ui px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.otpInvalid.isActive && (
            <p className="text-xs text-red-500 mt-1">
              {errors.otpInvalid.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-medium text-gray-600">
            New Password
          </label>
          <input
            type="password"
            value={fields.password}
            onChange={e => handleChange("password", e.target.value)}
            className="w-full mt-1 rounded-md border border-ui px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.passwordTooShort.isActive && (
            <p className="text-xs text-red-500 mt-1">
              {errors.passwordTooShort.message}
            </p>
          )}
        </div>

        {/* Re-password */}
        <div>
          <label className="text-xs font-medium text-gray-600">
            Re-enter Password
          </label>
          <input
            type="password"
            value={fields.rePassword}
            onChange={e => handleChange("rePassword", e.target.value)}
            className="w-full mt-1 rounded-md border border-ui px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.passwordsNotMatch.isActive && (
            <p className="text-xs text-red-500 mt-1">
              {errors.passwordsNotMatch.message}
            </p>
          )}
        </div>

        {errors.serverError.isActive && (
          <p className="text-sm text-red-600 text-center">
            {errors.serverError.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-ui text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-[#0073EA] text-white disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};
