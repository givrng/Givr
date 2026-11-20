import { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, Info, Loader2 } from "lucide-react";
import { IdentityVerificationFields, type IdentityDetails, type IdentityDetailsErrors } from "../IdVerificationWidget";
import useAuthFetch from "../hooks/useAuthFetch";
import { useConfirmAsk } from "../hooks/useConfirm";
import { isTrustedCheckoutUrl } from "../../utils/verification";
import type { ProfileProps } from "../../interface/interfaces";

type IdentityVerificationFormProps = {
  profile: ProfileProps;
  onClose: () => void;
};

type FormErrors = IdentityDetailsErrors & { consent?: string };

const NAME_PATTERN = /^[A-Za-z][A-Za-z' -]{0,49}$/;
// The ID number is sensitive, so only the rest of the form survives a refresh
const DRAFT_KEY = "individual_verification_draft";

const validate = (form: IdentityDetails, consent: boolean): FormErrors => {
  const errors: FormErrors = {};
  const idNumber = form.idNumber?.trim() ?? "";
  if (!idNumber) errors.idNumber = "Enter your ID number.";
  else if (form.idType === "NIN" && !/^\d{11}$/.test(idNumber)) errors.idNumber = "Your NIN should be 11 digits.";
  else if (!/^[A-Za-z0-9-]{5,20}$/.test(idNumber)) errors.idNumber = "Enter the ID number exactly as it appears on your ID.";
  if (form.idType === "VOTER_CARD" && !form.dateOfBirth) errors.dateOfBirth = "Enter your date of birth for voter's card checks.";
  if (!NAME_PATTERN.test(form.firstname?.trim() ?? "")) errors.firstname = "Enter your first name as it appears on your ID.";
  if (form.middleName?.trim() && !NAME_PATTERN.test(form.middleName.trim())) errors.middleName = "Use letters, spaces, hyphens or apostrophes only.";
  if (!NAME_PATTERN.test(form.lastname?.trim() ?? "")) errors.lastname = "Enter your last name as it appears on your ID.";
  if (!consent) errors.consent = "Please confirm before continuing.";
  return errors;
};

const readDraft = (): Partial<IdentityDetails> => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<IdentityDetails>) : {};
  } catch {
    return {};
  }
};

/**
 * Individual identity verification, shown on the profile like the organization verification form.
 * Submitting starts a Paystack checkout (POST /volunteer/profile/initiate/verification) and redirects to it.
 */
export const IdentityVerificationForm = ({ profile, onClose }: IdentityVerificationFormProps) => {
  const { API } = useAuthFetch("volunteer");
  const { confirmAsk, ConfirmDialog } = useConfirmAsk({ isOrg: false });

  const [form, setForm] = useState<IdentityDetails>(() => ({
    idType: "NIN",
    idNumber: "",
    dateOfBirth: "",
    // Pre-filled from the profile; the user confirms they match their ID
    firstname: profile.firstname ?? "",
    middleName: profile.middleName ?? "",
    lastname: profile.lastname ?? "",
    photoUrl: "",
    ...readDraft(),
  }));
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { idNumber: _omit, ...draft } = form;
    void _omit;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* storage unavailable */ }
  }, [form]);

  const handleChange = (patch: Partial<IdentityDetails>) => {
    const next = { ...patch };
    // Non-NIN IDs are alphanumeric; normalise so "a1234567b" and "A1234567B" are the same
    if (next.idNumber !== undefined && form.idType !== "NIN" && !("idType" in next)) {
      next.idNumber = next.idNumber.replace(/[^A-Za-z0-9-]/g, "").slice(0, 20).toUpperCase();
    }
    setForm((current) => ({ ...current, ...next }));
    setErrors((current) => {
      const cleared = { ...current };
      (Object.keys(next) as (keyof IdentityDetails)[]).forEach((key) => { delete cleared[key]; });
      return cleared;
    });
    setSubmitError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form, consent);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const confirmed = await confirmAsk({
      question: "You'll be taken to Paystack to pay the verification fee. Continue?",
      trueAnswer: "Continue to payment",
      falseAnswer: "Cancel",
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const { data } = await API().post("/profile/initiate/verification", {
        idType: form.idType,
        idNumber: form.idNumber?.trim(),
        firstname: form.firstname?.trim(),
        middleName: form.middleName?.trim() || undefined,
        lastname: form.lastname?.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        // Optional on the backend; omit it rather than sending an empty string
        individualLogo: form.photoUrl || undefined,
      });
      if (!isTrustedCheckoutUrl(data?.checkoutUrl)) throw new Error("untrusted checkout url");
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* storage unavailable */ }
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const data = axios.isAxiosError(error) ? (error.response?.data as { message?: unknown; checkoutUrl?: unknown } | undefined) : undefined;

      // 409: a verification (and its Paystack checkout) was already started for this account
      if (status === 409) {
        // Resume the existing checkout if the backend hands it back, rather than leaving the user stuck
        if (isTrustedCheckoutUrl(data?.checkoutUrl)) {
          window.location.assign(data.checkoutUrl);
          return;
        }
        setSubmitError(
          "You've already started a verification. If you've just paid, your status will update within a few minutes, so refresh your profile. If you didn't finish paying, contact Givr support to restart it."
        );
        setIsSubmitting(false);
        return;
      }

      setSubmitError(typeof data?.message === "string" ? data.message : "We couldn't start your verification. Check your details and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl w-full p-6">
      <ConfirmDialog />
      <h3 className="text-lg font-semibold mb-1">Verify your identity</h3>
      <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-500">
        Verification is required to create and publish initiatives. It shows volunteers there's a real, accountable person behind each one.
        After you submit, you'll pay the verification fee on Paystack and we'll review your details.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-y-4">
        <IdentityVerificationFields
          uploaderRole="volunteer"
          showMiddleName
          photoOptional
          disabled={isSubmitting}
          value={form}
          onChange={handleChange}
          errors={errors}
        />

        <label className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          <input type="checkbox" className="mt-0.5 accent-blue-600" checked={consent} disabled={isSubmitting}
            onChange={(e) => { setConsent(e.target.checked); setErrors((current) => ({ ...current, consent: undefined })); }} />
          <span>I confirm these details are mine and accurate, and I consent to Givr checking them with an identity verification provider.</span>
        </label>
        {errors.consent && <p role="alert" className="-mt-2 text-sm text-red-600">{errors.consent}</p>}

        {/* The backend only moves the status to PENDING once Paystack confirms the payment */}
        <p className="flex items-start gap-2 rounded-lg bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">
          <Info size={14} className="mt-0.5 shrink-0" />
          Already paid? Your status changes to "In review" once Paystack confirms your payment, which can take a few minutes. Refresh your profile before paying again.
        </p>

        {submitError && <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

        <div className="flex justify-end gap-x-2 pt-2">
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="px-6 py-3 font-semibold rounded-lg transition duration-200 whitespace-nowrap bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-md disabled:opacity-60">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition duration-200 whitespace-nowrap bg-[#1877F2] text-white hover:bg-[#156cd4] shadow-md disabled:opacity-60">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Redirecting to payment…</> : <><CreditCard size={16} /> Continue to payment</>}
          </button>
        </div>
      </form>
    </div>
  );
};
