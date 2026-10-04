import { API_BASE } from "@/lib/config";
import { STORE_CATEGORIES, type StoreItem } from "@/constants/relate";

/**
 * Store catalogue loading.
 *
 * The storefront is strictly API-driven: everything comes from the
 * admin-managed `store_items` collection (GET /api/store). Network and HTTP
 * failures throw so callers can render an explicit error state — there is no
 * bundled fallback anywhere in this module.
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

/** Server-side catalogue. Throws on network/HTTP failure; never falls back. */
export async function getStoreItems(): Promise<StoreItem[]> {
    const res = await fetch(`${API_BASE}/api/store`, {next: {revalidate: 60}});
    if (!res.ok) throw new Error(`store api ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json?.data)) throw new Error("unexpected store payload");
    const raw: ApiStoreItem[] = json.data;
    return raw
        .map(normalizeStoreItem)
        .filter((i): i is StoreItem => i !== null);
}

/** Server-side single item lookup; null when unknown, API failures throw. */
export async function getStoreItemById(id: string): Promise<StoreItem | null> {
    const items = await getStoreItems();
    return items.find((i) => i.id === id) ?? null;
}
