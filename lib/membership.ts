/**
 * Membership record held on the member's browser after they register.
 *
 * Written in two places so every kind of form can read it:
 *  - a cookie, so server components can prefill during SSR (the join form)
 *  - localStorage, so client components can read it directly (the quiz)
 *
 * The authoritative record lives in MongoDB (`club_join_applications`); this
 * is only the local copy used to fill in forms we have already been told.
 */

export type Membership = {
  name: string;
  age?: string;
  gender?: string;
  phone?: string;
  area?: string;
  clubSlug?: string;
  clubName?: string;
  interests?: string[];
  /** Squad joined at registration, if one was picked. */
  teamId?: string;
  teamName?: string;
  sport?: string;
  /** Unique membership ID — club letters, 8 characters in total (all caps). */
  reference?: string;
  /** Mongo id + live status of the record behind this copy. */
  id?: string;
  status?: string;
  joinedAt?: string;
};

export const MEMBER_COOKIE = "relate_member";
export const MEMBER_STORAGE_KEY = "relate:member";
const MAX_AGE = 60 * 60 * 24 * 365; // one year

/** Parse raw membership JSON (as written to localStorage), or null. */
export function parseMembershipJson(raw: string | undefined): Membership | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Membership;
    if (!parsed || typeof parsed.name !== "string" || !parsed.name.trim())
      return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Parse the raw cookie value into a membership, or null if unusable. */
export function parseMembership(raw: string | undefined): Membership | null {
  if (!raw) return null;
  try {
    return parseMembershipJson(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

/** Encoded value for `document.cookie` / the Set-Cookie header. */
export function serializeMembership(m: Membership): string {
  return encodeURIComponent(JSON.stringify(m));
}

export function membershipCookieString(m: Membership): string {
  return `${MEMBER_COOKIE}=${serializeMembership(m)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}
