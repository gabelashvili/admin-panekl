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

/**
 * Builds a dialable `tel:` href from a stored phone number.
 * Numbers already carrying the country code are kept as-is, local ones
 * (stored without it, e.g. "555123456") get the Georgian code prepended.
 * Returns an empty string when there is nothing to dial.
 */
export function toTelHref(phoneNumber?: string | number | null): string {
  if (phoneNumber === null || phoneNumber === undefined) return "";

  let digits = String(phoneNumber).replace(/\D/g, "").replace(/^00/, "");
  if (!digits) return "";

  if (digits.startsWith(COUNTRY_CODE)) return `tel:+${digits}`;

  digits = digits.replace(/^0/, "");
  // Anything longer than a Georgian national number already carries its own code.
  return digits.length <= 9 ? `tel:+${COUNTRY_CODE}${digits}` : `tel:+${digits}`;
}
