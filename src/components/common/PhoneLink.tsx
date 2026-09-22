import type React from "react";
import { formatPhoneNumber, toTelHref } from "../../utils/phone";

interface PhoneLinkProps {
  phoneNumber?: string | number | null;
  /** Rendered instead of a link when there is no number to dial. */
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Shows a phone number in the app's display format and dials it on click.
 * Colors are inherited so it blends into whatever cell or card it sits in.
 */
export default function PhoneLink({
  phoneNumber,
  fallback = null,
  className = "",
}: PhoneLinkProps) {
  const display = formatPhoneNumber(phoneNumber);
  const href = toTelHref(phoneNumber);

  if (!display || !href) return <>{fallback}</>;

  return (
    <a
      href={href}
      dir="ltr"
      title={`დარეკვა: ${display}`}
      onClick={(event) => event.stopPropagation()}
      className={`text-inherit underline-offset-2 hover:underline ${className}`}
    >
      {display}
    </a>
  );
}
