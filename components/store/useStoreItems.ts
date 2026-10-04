"use client";

import {useEffect, useState} from "react";
import {type StoreItem} from "@/constants/relate";
import {normalizeStoreItem} from "@/lib/store";

/**
 * Client-side catalogue for the storefront.
 *
 * Requests the relative /api/store path, which next.config rewrites to the
 * backend so the session/cookie stays first-party. The store is API-only:
 * the list starts empty and a failed request surfaces `error` for consumers
 * to render — there is no bundled fallback.
 */
export function useStoreItems(): {items: StoreItem[]; loading: boolean; error: string | null} {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/store", {cache: "no-store"});
                if (!res.ok) throw new Error(`store api ${res.status}`);
                const json = await res.json();
                if (!Array.isArray(json?.data)) throw new Error("unexpected store payload");
                const dbItems: StoreItem[] = json.data
                    .map(normalizeStoreItem)
                    .filter((i: StoreItem | null): i is StoreItem => i !== null);
                if (!cancelled) setItems(dbItems);
            } catch {
                if (!cancelled) setError("The store couldn't be loaded — check your connection and try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return {items, loading, error};
}
