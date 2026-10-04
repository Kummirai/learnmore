"use client";

import { useEffect, useMemo, useState } from "react";
import type { RelateClub } from "@/constants/relate";

type ClubsCatalog = {
    clubs: RelateClub[];
    subClubs: RelateClub[];
};

let request: Promise<ClubsCatalog> | null = null;

/** Single shared request per page load — every mounted hook reuses it. */
function loadCatalog(): Promise<ClubsCatalog> {
    if (!request) {
        request = fetch("/api/clubs", { cache: "force-cache" })
            .then(async (res) => {
                if (!res.ok) throw new Error(`clubs api ${res.status}`);
                const json = (await res.json()) as Partial<ClubsCatalog>;
                const clubs = Array.isArray(json.clubs) ? json.clubs : [];
                const subClubs = Array.isArray(json.subClubs) ? json.subClubs : [];
                if (clubs.length === 0) throw new Error("clubs api returned no clubs");
                return { clubs, subClubs };
            })
            .catch((err: unknown) => {
                request = null; // let the next mount retry
                throw err;
            });
    }
    return request;
}

export type UseClubs = {
    clubs: RelateClub[];
    subClubs: RelateClub[];
    /** Clubs first, then Sprout classes — registry order. */
    allClubs: RelateClub[];
    /** Slug lookup across clubs and classes; undefined while loading or unknown. */
    find: (slug?: string) => RelateClub | undefined;
    loading: boolean;
    error: string | null;
};

/**
 * Client catalogue for club definitions (navbar groups, theme accents, event
 * card gradients). Requests the relative /api/clubs path, which next.config
 * rewrites to the backend so the session stays first-party. Strictly API-only:
 * the list starts empty and a failed request surfaces `error` — no bundled
 * fallback.
 */
export function useClubs(): UseClubs {
    const [catalog, setCatalog] = useState<ClubsCatalog | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        loadCatalog()
            .then((data) => {
                if (!cancelled) setCatalog(data);
            })
            .catch(() => {
                if (!cancelled) setError("Clubs couldn't be loaded — check your connection and try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const allClubs = useMemo(
        () => (catalog ? [...catalog.clubs, ...catalog.subClubs] : []),
        [catalog],
    );
    const find = useMemo(() => {
        return (slug?: string) => (slug ? allClubs.find((c) => c.slug === slug) : undefined);
    }, [allClubs]);

    return {
        clubs: catalog?.clubs ?? [],
        subClubs: catalog?.subClubs ?? [],
        allClubs,
        find,
        loading,
        error,
    };
}
