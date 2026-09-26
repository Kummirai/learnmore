import { API_BASE } from "@/lib/config";
import { STORE_CATEGORIES, STORE_ITEMS, type StoreItem } from "@/constants/relate";

/**
 * Store catalogue loading.
 *
 * The storefront is driven by the admin-managed `store_items` collection
 * (GET /api/store), merged over the bundled STORE_ITEMS constants so the store
 * still works before anyone has added anything in the dashboard, and so the
 * seeded products keep their curated order.
 */

const VALID_CATEGORIES = STORE_CATEGORIES.filter((c) => c !== "All");

type ApiStoreItem = {
    id?: string;
    category?: string;
    name?: string;
    price?: number;
    blurb?: string;
    image?: string;
    images?: string[];
    sizes?: string[];
    details?: string[];
    offerPrice?: number | null;
    rating?: number | null;
};

/** Maps an API payload onto StoreItem, dropping rows with unusable data. */
export function normalizeStoreItem(raw: ApiStoreItem): StoreItem | null {
    if (!raw?.id || !raw?.name) return null;
    if (!VALID_CATEGORIES.includes(raw.category as never)) return null;
    if (typeof raw.price !== "number" || !Number.isFinite(raw.price)) return null;

    return {
        id: raw.id,
        category: raw.category as StoreItem["category"],
        name: raw.name,
        price: raw.price,
        blurb: raw.blurb ?? "",
        image: raw.image ?? "",
        images: raw.images ?? [],
        sizes: raw.sizes ?? [],
        details: raw.details ?? [],
        ...(raw.offerPrice != null ? {offerPrice: raw.offerPrice} : {}),
        ...(raw.rating != null ? {rating: raw.rating} : {}),
    };
}

/** DB items win over bundled ones with the same id; new DB items are appended. */
export function mergeStoreItems(dbItems: StoreItem[]): StoreItem[] {
    const byId = new Map(dbItems.map((i) => [i.id, i]));
    const merged: StoreItem[] = [];
    for (const bundled of STORE_ITEMS) {
        merged.push(byId.get(bundled.id) ?? bundled);
    }
    const bundledIds = new Set(STORE_ITEMS.map((i) => i.id));
    for (const item of dbItems) {
        if (!bundledIds.has(item.id)) merged.push(item);
    }
    return merged;
}

async function fetchApiItems(): Promise<ApiStoreItem[]> {
    const res = await fetch(`${API_BASE}/api/store`, {cache: "no-store"});
    if (!res.ok) throw new Error(`store api ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json?.data)) throw new Error("unexpected store payload");
    return json.data;
}

/** Server-side catalogue. Never throws — falls back to the bundled items. */
export async function getStoreItems(): Promise<StoreItem[]> {
    try {
        const items = (await fetchApiItems())
            .map(normalizeStoreItem)
            .filter((i): i is StoreItem => i !== null);
        return items.length > 0 ? mergeStoreItems(items) : STORE_ITEMS;
    } catch {
        return STORE_ITEMS;
    }
}

/** Server-side single item lookup across the merged catalogue. */
export async function getStoreItemById(id: string): Promise<StoreItem | null> {
    const items = await getStoreItems();
    return items.find((i) => i.id === id) ?? null;
}
