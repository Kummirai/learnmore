import type { Metadata } from "next";
import { getMagazine } from "@/constants/relate";
import { getClub } from "@/lib/clubs";

/**
 * SEO helpers — per-page titles/descriptions for clubs and magazines so
 * brand-name queries ("RelateWorld Pulse", "Footsteps magazine") resolve to
 * the right page instead of the default site title.
 */

export const SITE_URL = "https://relateworld.org";
export const SITE_NAME = "RelateWorld";

export function clipText(text: string, max = 158): string {
    return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function siteMetadata(overrides: Metadata, canonical: string): Metadata {
    return {
        metadataBase: new URL(SITE_URL),
        alternates: { canonical },
        ...overrides,
    };
}

/** Metadata for a main club or sub-club page (e.g. /sprout). Reads the
 *  catalogue at request time; a failed read falls back to the site defaults. */
export async function clubMetadataFromSlug(slug: string): Promise<Metadata> {
    let club;
    try {
        club = await getClub(slug);
    } catch {
        return {};
    }
    if (!club) return {};
    const title = `${club.name} Club · ${club.group} (${club.ageRange})`;
    return siteMetadata(
        {
            title,
            description: clipText(club.description),
            openGraph: {
                type: "website",
                url: `${SITE_URL}/${club.slug}`,
                siteName: SITE_NAME,
                title,
                description: clipText(club.description),
            },
        },
        `/${club.slug}`,
    );
}

/** Metadata for a magazine landing page (e.g. /footsteps). */
export function magazineMetadataFromSlug(slug: string): Metadata {
    const mag = getMagazine(slug);
    if (!mag) return {};
    const title = `${mag.series} · ${mag.theme}`;
    return siteMetadata(
        {
            title,
            description: clipText(mag.summary),
            openGraph: {
                type: "website",
                url: `${SITE_URL}/${mag.slug}`,
                siteName: SITE_NAME,
                title,
                description: clipText(mag.summary),
            },
        },
        `/${mag.slug}`,
    );
}
