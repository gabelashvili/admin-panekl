import type { ParentInfoFields } from "../store/server/requets/interfaces";

export interface ParentInfo {
  name: string | null;
  personalNumber: string | null;
  phoneNumber: string | null;
}

const clean = (value?: string | null) => value?.trim() || null;

/**
 * Picks the parent details off an API user object.
 * Returns null when none of the parent fields are filled in,
 * since not every minor has parent info attached.
 */
export function getParentInfo(source?: ParentInfoFields | null): ParentInfo | null {
  if (!source) return null;

  const info = {
    name: clean(source.parentName),
    personalNumber: clean(source.parentPersonalNumber),
    phoneNumber: clean(source.parentPhoneNumber),
  };

  return info.name || info.personalNumber || info.phoneNumber ? info : null;
}
