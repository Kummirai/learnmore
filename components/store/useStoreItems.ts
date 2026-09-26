"use client";

import {useEffect, useState} from "react";
import {STORE_ITEMS, type StoreItem} from "@/constants/relate";
import {mergeStoreItems, normalizeStoreItem} from "@/lib/store";

/**
 * Client-side catalogue for the storefront.
 *
 * Requests the relative /api/store path, which next.config rewrites to the
 * backend so the session/cookie stays first-party. Falls back to the bundled
 * STORE_ITEMS when the API is unreachable or has nothing in it yet.
 */
export function useStoreItems(): {items: StoreItem[]; loading: boolean} {
    const [items, setItems] = useState<StoreItem[]>(STORE_ITEMS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/store", {cache: "no-store"});
                if (!res.ok) throw new Error(`store api ${res.status}`);
                const json = await res.json();
                const dbItems = (Array.isArray(json?.data) ? json.data : [])
                    .map(normalizeStoreItem)
                    .filter((i: StoreItem | null): i is StoreItem => i !== null);
                if (!cancelled) {
                    setItems(dbItems.length > 0 ? mergeStoreItems(dbItems) : STORE_ITEMS);
                }
            } catch {
                if (!cancelled) setItems(STORE_ITEMS);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return {items, loading};
}
