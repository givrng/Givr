import type { IndividualVerificationStatus } from "../interface/interfaces";

/**
 * Individual identity verification, as the UI talks about it.
 * The backend has six raw statuses; people only need to know these four.
 */
export type VerificationState = "verified" | "in_review" | "failed" | "unverified";

export function getVerificationState(status?: IndividualVerificationStatus | string | null): VerificationState {
  switch (status) {
    case "VERIFIED":
      return "verified";
    // PENDING is set once Paystack confirms payment; the automatic states are the provider's check
    case "PENDING":
    case "AUTOMATIC_VERIFICATION_PENDING":
    case "AUTOMATIC_VERIFICATION_SUCCEEDED":
      return "in_review";
    case "AUTOMATIC_VERIFICATION_FAILED":
      return "failed";
    default:
      return "unverified";
  }
}

/**
 * Where individuals verify: the Profile tab of the volunteer dashboard, opened straight on the form.
 * Organizations verify from their profile the same way.
 */
export const VERIFY_IDENTITY_PATH = "/volunteer?verify=identity";

/** Only follow checkout links to the payment provider, never an arbitrary URL from a response */
export function isTrustedCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "paystack.com" || url.hostname.endsWith(".paystack.com"));
  } catch {
    return false;
  }
}
