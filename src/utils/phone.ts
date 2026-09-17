const COUNTRY_CODE = "995";

/**
 * Strips the Georgian country code from a phone number for display,
 * e.g. "+995555123456" / "995 555 123 456" -> "555123456".
 * Numbers without the country code are returned untouched.
 */
export function formatPhoneNumber(
  phoneNumber?: string | number | null
): string {
  if (phoneNumber === null || phoneNumber === undefined) return "";

  const trimmed = String(phoneNumber).trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith(COUNTRY_CODE) && digits.length > COUNTRY_CODE.length) {
    return digits.slice(COUNTRY_CODE.length);
  }

  return trimmed;
}
