import { API_BASE } from "@/lib/config";
import type { RelateClub } from "@/constants/relate";

/**
 * Clubs catalogue — website access layer.
 *
 * Server-side reader for GET /api/clubs: the backend owns every club and
 * Sprout class definition (Sprout → Synergy plus Sprout Kids / Tweens /
 * Teens), so club pages, nav groups and SEO metadata all resolve through this
 * module instead of a bundled copy. Catalogue reads are revalidated every five
 * minutes; failures throw so callers can render an explicit error state —
 * there is no bundled fallback.
 */
export type ClubsCatalog = {
    clubs: RelateClub[];
    subClubs: RelateClub[];
};

function toCatalog(raw: unknown): ClubsCatalog {
    const payload = (raw ?? {}) as { clubs?: unknown; subClubs?: unknown };
    const clubs = Array.isArray(payload.clubs) ? (payload.clubs as RelateClub[]) : [];
    const subClubs = Array.isArray(payload.subClubs) ? (payload.subClubs as RelateClub[]) : [];
    if (clubs.length === 0) throw new Error("clubs api returned no clubs");
    return { clubs, subClubs };
}

/** Full catalogue: top-level clubs plus the Sprout classes. */
export async function getClubsCatalog(): Promise<ClubsCatalog> {
    const res = await fetch(`${API_BASE}/api/clubs`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`clubs api ${res.status}`);
    return toCatalog(await res.json());
}

/** Every club and sub-club class, registry order (top-level first). */
export async function getAllClubs(): Promise<RelateClub[]> {
    const { clubs, subClubs } = await getClubsCatalog();
    return [...clubs, ...subClubs];
}

/**
 * Look up a club or Sprout class by slug — undefined for unknown slugs,
 * thrown error when the catalogue itself cannot be loaded.
 */
export async function getClub(slug: string | undefined): Promise<RelateClub | undefined> {
    if (!slug) return undefined;
    return (await getAllClubs()).find((club) => club.slug === slug);
}

/** A club's Sprout classes (kids / tweens / teens); empty for other clubs. */
export async function getClubClasses(slug: string): Promise<RelateClub[]> {
    const { subClubs } = await getClubsCatalog();
    return subClubs.filter((club) => club.parentSlug === slug);
}

const DEFAULT_ACCENT = "#13c5dd";
const DEFAULT_ACCENT_DARK = "#0fa3c4";

/**
 * Accent colours for a club page's CSS variables. The colours come from the
 * catalogue like the rest of the club document; the site accent is only used
 * when the catalogue itself cannot be read, so theming never crashes a page.
 */
export async function getClubAccent(
    slug: string,
): Promise<{ color: string; colorDark: string }> {
    try {
        const club = await getClub(slug);
        if (club) return { color: club.color, colorDark: club.colorDark };
    } catch {
        // fall through to the site defaults
    }
    return { color: DEFAULT_ACCENT, colorDark: DEFAULT_ACCENT_DARK };
}
