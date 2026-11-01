/**
 * Phone number rules shared across forms.
 * Mirrors the backend constraint: digits only, between 11 and 16 digits long.
 */
export const PHONE_MIN_DIGITS = 11;
export const PHONE_MAX_DIGITS = 16;

/**
 * Strips everything except digits so pasted values like "+234 801-234-5678"
 * are accepted, and caps the result at the maximum allowed length.
 *
 * @example sanitizePhoneInput("+234 801-234-5678") // "2348012345678"
 */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_MAX_DIGITS);
}

/**
 * @example isValidPhoneNumber("08012345678") // true
 * @example isValidPhoneNumber("0801234")     // false
 */
export function isValidPhoneNumber(value: string): boolean {
  return new RegExp(`^\\d{${PHONE_MIN_DIGITS},${PHONE_MAX_DIGITS}}$`).test(value);
}
